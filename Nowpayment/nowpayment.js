const AutoReceipt = require("../Models/Receiptautomated")
const TopUpWallet = require("../Models/Topupwallet")
const NowPaymentsApi = require("@nowpaymentsio/nowpayments-api-js")
const NPApi = new NowPaymentsApi ({apiKey: process.env.npapikey})
const http = require('http');
const crypto = require('crypto');
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



// exports.createinvoicefunds = (req, res) => {
//     let randomid = generateRandomString()
//     const { amount, playfabToken, username, playerPlayfabId,} = req.body

//     const data = {
//         price_amount: amount,
//         price_currency: "usd",
//         order_id: randomid,
//         order_description: `Top Up $${amount}`,
//         ipn_callback_url: "https://mml-test-api.onrender.com/coin/verify",
//         success_url: `https://monmonland.games/`,
//         cancel_url: `https://monmonland.games/`,
//         is_fixed_rate: true,
//         is_fee_paid_by_user: true
//     }

//     NPApi.createInvoice(data)
//     .then(async item => {
//         await AutoReceipt.create({
//             receiptId: item.order_id,
//             orderCode: item.id,
//             username: username,
//             playerPlayfabId: playerPlayfabId,
//             subscriptionType: `Top Up $${item.price_amount}`,
//             amount: item.price_amount,
//             playfabToken: playfabToken
//         })
        
//         res.json({message: "success", data: item})
//     })
//     .catch((error) => res.status(500).json({ error: error.message }));

// }

// exports.createinvoicebundles = (req, res) => {
//     let randomid = generateRandomString()
//     const { amount, playfabToken, username, playerPlayfabId, bundle, bundledescription, subs} = req.body

//     const data = {
//         price_amount: amount,
//         price_currency: "usd",
//         order_id: randomid,
//         order_description: bundledescription,
//         ipn_callback_url: "https://mml-test-api.onrender.com/coin/verify",
//         success_url: `https://monmonland.games/`,
//         cancel_url: `https://monmonland.games/`,
//         is_fixed_rate: true,
//         is_fee_paid_by_user: true
//     }

//     NPApi.createInvoice(data)
//     .then(async item => {
//         await AutoReceipt.create({
//             receiptId: item.order_id,
//             orderCode: item.id,
//             username: username,
//             playerPlayfabId: playerPlayfabId,
//             subscriptionType: bundle,
//             amount: item.price_amount,
//             playfabToken: playfabToken
//         })
        
//         res.json({message: "success", data: item})
//     })
//     .catch((error) => res.status(500).json({ error: error.message }));

// }

// exports.verifypayments = (request, response) => {
//     let error_msg = "Unknown error";
//     let auth_ok = false;
//     let received_hmac = request.headers['x-nowpayments-sig'];
//     let body = null;

//     if (received_hmac) {
//         let body = '';
//         request.on('data', (chunk) => {
//             body += chunk.toString();
//         });

//         request.on('end', () => {
//             try {
//                 body = JSON.parse(body);
//                 const sorted_body = JSON.stringify(body, null, 0);
//                 const hmac = crypto.createHmac('sha512', process.env.ipnkey) // Replace 'yourIpnSecret' with your actual IPN secret
//                     .update(sorted_body)
//                     .digest('hex');

//                 if (hmac === received_hmac) {
//                     auth_ok = true;
//                 } else {
//                     error_msg = 'HMAC signature does not match';
//                 }
//             } catch (err) {
//                 error_msg = 'Error parsing JSON data';
//             }

//             // Respond based on authentication result
//             if (auth_ok) {
                

//                 AutoReceipt.findOne({receiptId: body.order_id})
//                 .then(item => {
//                     if(!item){
//                         response.statusCode = 400;
//                         response.end(error_msg);
//                     }
                    
//                     if(item.status !== 'pending'){
//                         response.statusCode = 400;
//                         response.end(error_msg);
//                     }
                    
//                     if(request_data.payment_status !== "partially_paid" && request_data.payment_status !== "finished" && request_data.payment_status !== "failed" && request_data.payment_status !== "expired"){
//                         response.statusCode = 400;
//                         response.end(error_msg);
//                     }

//                     if(request_data.payment_status === "partially_paid"){
//                         item.amount = request_data.actually_paid
//                     }

//                     if(request_data.payment_status === "failed" || request_data.payment_status === "expired" ){
//                         AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel"})
//                        .then(()=> {
//                             response.statusCode = 200;
//                             response.end('OK');
//                         })
//                         .catch(err => {
//                             response.statusCode = 400;
//                             response.end(error_msg);
//                         })
//                         return
//                     }

//                     PlayFab._internalSettings.sessionTicket = item.playfabToken;
//                     PlayFabClient.ExecuteCloudScript({
//                         FunctionName: "Topup",
//                         FunctionParameter: {
//                         playerId: item.playerPlayfabId,
//                         topupAmount: item.amount,
//                         },
//                         ExecuteCloudScript: true,
//                         GeneratePlayStreamEvent: true,
//                     }, (error1, result1) => {
//                         if(result1.data.FunctionResult.message === "success"){
//                         AutoReceipt.findByIdAndUpdate(item._id, {status: "success"}, {new: true})
//                         .then(data => {
//                             TopUpWallet.findByIdAndUpdate({_id: process.env.automaticid}, {$inc: {amount: item.amount}})
//                             .then(()=> {
//                                 response.statusCode = 200;
//                                 response.end('OK');
//                             })
//                             .catch(err => {
//                                 response.statusCode = 400;
//                                 response.end(error_msg);
//                             })
//                         })
//                         .catch(err => {
//                             response.statusCode = 400;
//                             response.end(error_msg);
//                         })
//                         } else {
//                             response.statusCode = 400;
//                             response.end(error_msg);
//                         }
//                     })
//                 })
//                 .catch(err => {
//                     response.statusCode = 400;
//                     response.end(error_msg);
//                 })

//             } else {
//                 response.statusCode = 400;
//                 response.end(error_msg);
//             }
//         });
//     } else {
//         response.statusCode = 400;
//         response.end('No HMAC signature sent.');
//     }
// }

exports.createinvoicefunds = (req, res) => {
    let randomid = generateRandomString()
    const { amount, playfabToken, username, playerPlayfabId,} = req.body

    const data = JSON.stringify({
        price_amount: amount,
        price_currency: "usd",
        order_id: randomid,
        order_description: `Top Up $${amount}`,
        ipn_callback_url: "https://mml-test-api.onrender.com/nowpay/verify",
        success_url: `https://monmonland.games/`,
        cancel_url: `https://monmonland.games/`,
        is_fixed_rate: true,
        is_fee_paid_by_user: true
    })

    var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api-sandbox.nowpayments.io/v1/invoice',
        headers: { 
          'x-api-key': process.env.npapikey, 
          'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(async item => {
        await AutoReceipt.create({
            receiptId: item.data.order_id,
            orderCode: item.data.id,
            username: username,
            playerPlayfabId: playerPlayfabId,
            subscriptionType: `Top Up $${item.data.price_amount}`,
            amount: item.data.price_amount,
            playfabToken: playfabToken
        })
        // console.log(item)
        res.json({message: "success", data: item.data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));

    // NPApi.createInvoice(data)
    // .then(async item => {
    //     await AutoReceipt.create({
    //         receiptId: item.order_id,
    //         orderCode: item.id,
    //         username: username,
    //         playerPlayfabId: playerPlayfabId,
    //         subscriptionType: `Top Up $${item.price_amount}`,
    //         amount: item.price_amount,
    //         playfabToken: playfabToken
    //     })
        
    //     res.json({message: "success", data: item})
    // })
    // .catch((error) => res.status(500).json({ error: error.message }));

}

exports.verifypayments = (request, response) => {
    console.log("hello")
    let error_msg = "Unknown error";
    let auth_ok = false;
    let received_hmac = request.headers['x-nowpayments-sig'];
    let request_data = null;
    console.log(received_hmac)
    if (received_hmac) {
        let body = {};
        console.log("body: ", request.body)
        const sortedkey = Object.keys(request.body).sort()

        for(const key of sortedkey){
            body[key] = request.body[key]
        }

        console.log("bodyvalue: ", body)

        try {
            // request_data = JSON.parse(body);
            // const sorted_request_data = JSON.stringify(request_data, null, 0);
            const hmac = crypto.createHmac('sha512', process.env.ipnkey) // Replace 'yourIpnSecret' with your actual IPN secret
                .update(JSON.stringify(body))
                .digest('hex');
            console.log("hmac: ",hmac)
            if (hmac === received_hmac) {
                auth_ok = true;
            } else {
                error_msg = 'HMAC signature does not match';
            }
        } catch (err) {
            error_msg = 'Error parsing JSON data';
            console.log(err)
        }
        console.log(auth_ok)
        // Respond based on authentication result
        if (auth_ok) {
            console.log(body.order_id)

            AutoReceipt.findOne({receiptId: body.order_id})
            .then(item => {
                if(!item){
                    response.statusCode = 400;
                    response.end(error_msg);
                }
                
                if(item.status !== 'pending'){
                    response.statusCode = 400;
                    response.end(error_msg);
                }
                console.log(body.payment_status)
                if(body.payment_status !== "partially_paid" || body.payment_status !== "finished" || body.payment_status !== "failed" || body.payment_status !== "expired"){
                    console.log("jabadurb")
                    response.statusCode = 400;
                    response.end(error_msg);
                }

                if(body.payment_status === "partially_paid"){
                    item.amount = body.actually_paid
                }

                if(body.payment_status === "failed" || body.payment_status === "expired" ){
                    AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel"})
                   .then(()=> {
                        response.statusCode = 200;
                        response.end('OK');
                    })
                    .catch(err => {
                        response.statusCode = 400;
                        response.end(error_msg);
                    })
                    return
                }

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
                    if(result1.data.FunctionResult.message === "success"){
                    AutoReceipt.findByIdAndUpdate(item._id, {status: "success"}, {new: true})
                    .then(data => {
                        TopUpWallet.findByIdAndUpdate({_id: process.env.automaticid}, {$inc: {amount: item.amount}})
                        .then(()=> {
                            response.statusCode = 200;
                            response.end('OK');
                        })
                        .catch(err => {
                            response.statusCode = 400;
                            response.end(error_msg);
                        })
                    })
                    .catch(err => {
                        response.statusCode = 400;
                        response.end(error_msg);
                    })
                    } else {
                        response.statusCode = 400;
                        response.end(error_msg);
                    }
                })
            })
            .catch(err => {
                response.statusCode = 400;
                response.end(error_msg);
            })

        } else {
            response.statusCode = 400;
            response.end(error_msg);
        }
    } else {
        response.statusCode = 400;
        response.end('No HMAC signature sent.');
    }
}