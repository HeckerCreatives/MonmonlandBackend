var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
const AutoReceipt = require("../Models/Receiptautomated")
const TopUpWallet = require("../Models/Topupwallet")
var axios = require('axios');

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
}

exports.create = (req, res) => {
    const { amount, description, email, playfabToken, username, playerPlayfabId } = req.body
    const uniqueId = generateRandomString()
    const merchantId = process.env.merchantid
    const password = process.env.merchantpass
    const data = {
        "Amount": amount,
        "Currency": "USD",
        "Description": description,
        "Email": email
    }

    const config = {
        method: 'post',
        url: `https://test.dragonpay.ph/api/collect/v1/${uniqueId}/post`,
        headers: { 
            'Authorization': 'Basic ' + Buffer.from(merchantId + ':' + password).toString('base64'),
            'Content-Type': 'application/json'
        },
        data : data
    }

    axios(config)
    .then(async item => {
        await AutoReceipt.create({
            receiptId: uniqueId,
            orderCode: item.data.RefNo,
            username: username,
            playerPlayfabId: playerPlayfabId,
            subscriptionType: description,
            amount: amount,
            playfabToken: playfabToken
        })
        // console.log(item)
        res.json({message: "success", data: item.data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));

}

exports.verifypayments = (request, response) => {
    // console.log("hello")
    let error_msg = "Unknown error";
    let auth_ok = false;
    let received_hmac = request.headers['x-nowpayments-sig'];
    let request_data = null;
    // console.log(received_hmac)
    if (received_hmac) {
        let body = {};
        // console.log("headers ", request.headers)
        // console.log("body: ", request)
        const sortedkey = Object.keys(request.body).sort()

        for(const key of sortedkey){
            body[key] = request.body[key]
        }

        AutoReceipt.findOne({receiptId: body.order_id})
        .then(item => {
            if(!item){
                response.statusCode = 400;
                response.end(error_msg);
                return
            }
            
            if(item.status !== 'pending'){
                response.statusCode = 400;
                response.end(error_msg);
                return
            }
            // console.log(body.payment_status)
            if(body.payment_status !== "partially_paid" && body.payment_status !== "finished" && body.payment_status !== "failed" && body.payment_status !== "expired"){
                // console.log("jabadurb")
                response.statusCode = 400;
                response.end(error_msg);
                return
            }

            if(body.payment_status === "failed" || body.payment_status === "expired" ){
                AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel"})
                .then(()=> {
                    response.statusCode = 200;
                    response.end('OK');
                    return
                })
                .catch(err => {
                    response.statusCode = 400;
                    response.end(error_msg);
                    return
                })
                return
            }

            if(body.payment_status === "partially_paid"){
                item.amount = body.actually_paid
            }
            // console.log(item.playfabToken)
            PlayFab._internalSettings.sessionTicket = item.playfabToken;
            PlayFabClient.ExecuteCloudScript({
                FunctionName: "Topup",
                FunctionParameter: {
                playerId: item.playerPlayfabId,
                topupAmount: item.amount,
                },
                ExecuteCloudScript: true,
                GeneratePlayStreamEvent: true,
            }, (error1, result1) => {
                // console.log(result1)
                // console.log(error1)
                if(result1.data.FunctionResult.message === "success"){
                AutoReceipt.findByIdAndUpdate(item._id, {status: "success", orderCode: body.refno}, {new: true})
                .then(data => {
                    TopUpWallet.findByIdAndUpdate({_id: process.env.automaticid}, {$inc: {amount: item.amount}})
                    .then(()=> {
                        response.statusCode = 200;
                        response.end('OK');
                        return
                    })
                    .catch(err => {
                        response.statusCode = 400;
                        response.end(error_msg);
                        return
                    })
                })
                .catch(err => {
                    response.statusCode = 400;
                    response.end(error_msg);
                    return
                })
                } else {
                    response.statusCode = 400;
                    response.end(error_msg);
                    return
                }
            })
        })
        .catch(err => {
            response.statusCode = 400;
            response.end(error_msg);
            return
        })

        // const sorted_request_data = JSON.stringify(body, Object.keys(body).sort());
        // console.log("bodyvalue: ", sorted_request_data)
        

        // try {
        //     const hmac = crypto.createHmac('sha512', process.env.ipnkey).update(JSON.stringify(body, Object.keys(body).sort())).digest('hex')

        //     console.log("hmac: ", hmac)
        //     if (hmac === received_hmac) {
        //         auth_ok = true;
        //     } else {
        //         error_msg = 'HMAC signature does not match';
        //     }
        // } catch (err) {
        //     error_msg = 'Error parsing JSON data';
        //     console.log(err)
        // }
        // console.log(auth_ok) // THIS IS NOW TRUE
        // // Respond based on authentication result
        // if (auth_ok) {
        //     // console.log(body.order_id)
            
            

        // } else {
        //     response.statusCode = 400;
        //     response.end(error_msg);
        //     return
        // }
    } else {
        response.statusCode = 400;
        response.end('No HMAC signature sent.');
        return
    }
}