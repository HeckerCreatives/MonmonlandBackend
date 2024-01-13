var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = process.env.monmontitleid;
const AutoReceipt = require("../Models/Receiptautomated")
const TopUpWallet = require("../Models/Topupwallet")
const Dragonpayout = require("../Models/Dragonpayout")
var axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const Subscription = require("../Models/Subscription")
const Exchangerate = require("../Models/Exchangerate");
const Gameusers = require('../Gamemodels/Gameusers')
const Wallets = require('../Gamemodels/Wallets')
const Wallethistory = require('../Gamemodels/Wallethistory')
const Dragonpayoutrequest = require('../Models/Dragonpayoutrequest')
const DragonpayURL = process.env.dragonpayurl

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
  
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return randomString;
}

exports.createfunds = (req, res) => {
    const { amount, email, playfabToken, username, playerPlayfabId } = req.body
    const uniqueId = generateRandomString()
    const merchantId = process.env.merchantid
    const password = process.env.merchantpass

    const data = {
        "Amount": amount,
        "Currency": "PHP",
        "Description": `Top Up`,
        "Email": email
    }

    const config = {
        method: 'post',
        url: `${DragonpayURL}/collect/v1/${uniqueId}/post`,
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
            subscriptionType: `Top Up`,
            amount: amount,
            playfabToken: playfabToken
        })
        // console.log(item)
        res.json({message: "success", data: item.data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));

}

exports.createbundles = (req, res) => {
    const uniqueId = generateRandomString()
    const { amount, playfabToken, username, playerPlayfabId, bundle, bundledescription, subs, email} = req.body
    const merchantId = process.env.merchantid
    const password = process.env.merchantpass

    const data = {
        "Amount": amount,
        "Currency": "PHP",
        "Description": bundledescription,
        "Email": email
    }

    const config = {
        method: 'post',
        url: `${DragonpayURL}/collect/v1/${uniqueId}/post`,
        headers: { 
            'Authorization': 'Basic ' + Buffer.from(merchantId + ':' + password).toString('base64'),
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(async item => {
        await AutoReceipt.create({
            receiptId: uniqueId,
            orderCode: item.data.RefNo,
            username: username,
            playerPlayfabId: playerPlayfabId,
            subscriptionType: bundle,
            amount: amount,
            playfabToken: playfabToken
        })
        // console.log(item)
        res.json({message: "success", data: item.data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));

}

exports.verifypayments = async (request, response) => {
  // Assuming Request and Application objects are available in your context
  const txnid = request.body.txnid; // Adjust this according to your actual object structure
  const refno = request.body.refno; // Adjust this according to your actual object structure
  const status = request.body.status; // Adjust this according to your actual object structure
  const message = request.body.message; // Adjust this according to your actual object structure
  const procid = request.body.procid; // Adjust this according to your actual object structure
  const receivedDigest = request.body.digest; // Adjust this according to your actual object structure
  const secretKey = process.env.merchantpass; // Replace with your actual secret key

  // Function to calculate SHA-1 hash
  function getSHA1Digest(data) {
    return crypto.createHash('sha1').update(data).digest('hex');
  }

  const usdrate = await Exchangerate.findOne({_id: process.env.exchangerate})
    .then(data => {
        return data.amount
    })

  // Calculate the SHA-1 digest for the received message
  const calculatedDigest = getSHA1Digest(`${txnid}:${refno}:${status}:${message}:${secretKey}`);
  // Check if the received digest matches the calculated one
  if (calculatedDigest !== receivedDigest) {
    // Display an error message and send a response
    console.error("Error: Digest mismatch. Aborting processing.");
    response.status(400).send("Error: Digest mismatch. Aborting processing.");
  } else {
    // Check if status is 'SUCCESS'
    if (status === 'S') {
      // Process customer order for shipment
    AutoReceipt.findOne({receiptId: txnid})
    .then(item => {
        if(!item){
            response.status(400).send("Error: item not found");
            return
        }
        
        if(item.status !== 'pending'){
            response.status(400).send("Error: item alrady process");
            return
        }

        // if(status !== "partially_paid" && status !== "finished" && status !== "failed" && status !== "expired"){
           
        //     response.statusCode = 400;
        //     response.end(error_msg);
        //     return
        // }

        if(status === "F" || status === 'V'){
            AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel", orderCode: refno, procId: procid})
            .then(()=> {
                response.statusCode = 200;
                response.end('OK');
                return
            })
            .catch(err => {
                response.status(400).send(err);
                return
            })
            return
        }

        // if(body.payment_status === "partially_paid"){
        //     item.amount = body.actually_paid
        // }
        const finalamount = (item.amount / usdrate)

        AutoReceipt.findByIdAndUpdate(item._id, {status: "success", orderCode: refno, procId: procid}, {new: true})
        .then(async data => {
            const id = await Gameusers.findOne({username: data.username}).then(user => user._id)
            const history = {
                owner: id,
                amount: finalamount,
                type: 'Topup Balance',
                description: 'Topup Balance',
                historystructure: data.subscriptionType
            }

            await Wallets.findOneAndUpdate({owner: id, wallettype: 'balance'},{$inc: {amount: finalamount}}).then(() => {
                Wallethistory.create(history)
                TopUpWallet.findByIdAndUpdate({_id: process.env.automaticid}, {$inc: {amount: finalamount}})
                .then(()=> {
                    response.statusCode = 200;
                    response.end('OK');
                    return
                })
                .catch(err => {
                    response.status(400).send(err);
                    return
                })
                
            })
            
        })
        .catch(err => {
            response.status(400).send(err);
            return
        })

        // PlayFab._internalSettings.sessionTicket = item.playfabToken;
        // PlayFabClient.ExecuteCloudScript({
        //     FunctionName: "Topup",
        //     FunctionParameter: {
        //     playerId: item.playerPlayfabId,
        //     topupAmount: finalamount,
        //     },
        //     ExecuteCloudScript: true,
        //     GeneratePlayStreamEvent: true,
        // }, (error1, result1) => {
        //     if(result1.data.FunctionResult.message === "success"){
           
        //     } else {
        //         response.status(400).send("Error: Please Contact Admin");
        //         return
        //     }
        // })
    })
    .catch(err => {
        response.status(400).send(err);
        return
    })
      
    } else {
      // Handle other cases as needed
      console.log("Status is not 'SUCCESS'. Handle accordingly.");
      response.status(200).send("Payment verification successful. Status is not 'SUCCESS'.");
    }
  }
};

// exports.createpayout = (info) => {
//     const { Amount, Email, MobileNo, FirstName, MiddleName, LastName, ProcDetail, ProcId , BirthDate, Nationality, Street1, Street2, Barangay, City, Province, Country, owner } = info
    
//     const uniqueId = generateRandomString()
//     const merchantId = process.env.merchantid
//     const password = process.env.merchantpass
//     const apiKey = process.env.merchantapi
//     const currentDate = new Date();
//     const dateString = currentDate.toDateString();

//     const data = { 
//         TxnId: uniqueId, 
//         FirstName: FirstName,
//         MiddleName: MiddleName,
//         LastName: LastName,
//         Amount: Amount,
//         Currency: "PHP", 
//         Description: "MML Payout",
//         ProcId: ProcId, 
//         ProcDetail: ProcDetail, // Account or mobile no of payout channel
//         RunDate: dateString, 
//         Email: Email, 
//         MobileNo: MobileNo, 
//         BirthDate: BirthDate, 
//         Nationality: Nationality, 
//         Address:
//         { Street1: Street1, 
//           Street2: Street2, 
//           Barangay: Barangay, 
//           City : City, 
//           Province: Province, 
//           Country: Country
//         }
//     }
//     // console.log(data)

//     const config = {
//         method: 'post',
//         url: `${DragonpayURL}/payout/merchant/v1/${merchantId}/post`,
//         headers: { 
//             'Authorization': `Bearer ${apiKey}`,
//             'Content-Type': 'application/json',
//         },
//         data : data
//     }
//     // console.log("Dragonpay API Request:", config);
//     axios(config)
//     .then(async response => {
//         if (response.status === 200) {
//             await Dragonpayout.create(data)
//             .then(item => {
//                 Dragonpayout.findByIdAndUpdate(item._id, {Refno: response.data.Message, owner: owner})
//                 .then((data) => {
//                     // res.json({ message: "success", data: response.data });
//                     return `success`
//                 })
                
//             })
            
//         } else {
//             // Handle other status codes
//             return `failed`
//         }
//     })
//     .catch(error => `failed`);

// }

exports.verifypayout = (request, response) => {
    
    const txnid = request.query.merchantTxnId; // Adjust this according to your actual object structure
    const refno = request.query.refNo; // Adjust this according to your actual object structure
    const status = request.query.status; // Adjust this according to your actual object structure
    const message = request.query.message; // Adjust this according to your actual object structure
    const receivedDigest = request.query.digest; // Adjust this according to your actual object structure
    const secretKey = process.env.merchantpass; // Replace with your actual secret key
  
    // Function to calculate SHA-1 hash
    function getSHA1Digest(data) {
        return crypto.createHash('sha1').update(data).digest('hex');
    }
  
    // Calculate the SHA-1 digest for the received message
    const calculatedDigest = getSHA1Digest(`${txnid}:${refno}:${status}:${message}:${secretKey}`);
    // Check if the received digest matches the calculated one
    if (calculatedDigest !== receivedDigest) {
      // Display an error message and send a response
      console.error("Error: Digest mismatch. Aborting processing.");
      response.status(400).send("Error: Digest mismatch. Aborting processing.");
    } else {
      // Check if status is 'SUCCESS'
      if (status === 'S') {
        // Process customer order for shipment
       Dragonpayout.findOne({TxnId: txnid})
      .then(item => {
          if(!item){
              response.status(400).send("Error: item not found");
              console.error("item not found");
              return
          }
          
            if(item.Status !== 'pending'){
              response.status(200).send("this is already process");
              console.error("this is already process");
              return
            }
  
          if(status === "F" || status === 'V'){
               Dragonpayout.findByIdAndUpdate(item._id, {Status: "cancel", Refno: refno})
              .then(()=> {
                Dragonpayoutrequest.findOneAndUpdate({id: item.id}, {status: 'cancel'})
                .populate({
                    path: "paymentdetails"
                })
                .then((async (data) => {
                    await Wallets.findOneAndUpdate({owner: data.paymentdetails.owner, wallettype: 'balance'}, {$inc: {amount: data.amount}})
                    response.status(200).send('OK');
                    return
                }))
              })
              .catch(err => {
                  response.status(400).send(err);
                  console.error(err);
                  return
              })
              return
          }

            Dragonpayout.findByIdAndUpdate(item._id, {Status: "success", Refno: refno}, {new: true})
            .then(() => {
                Dragonpayoutrequest.findOneAndUpdate({id: item.id}, {status: 'success'})
                .then((() => {
                    response.status(200).send('OK');
                    return
                }))
            })
            .catch(err => {
                response.status(400).send(err);
                console.error(err);
                return
            })
      })
        
      } else {
        // Handle other cases as needed
        console.log(`Status is not 'SUCCESS'. Handle accordingly. ${status}`);
        response.status(200).send("Payment verification successful. Status is not 'SUCCESS'.");
      }
    }
};

exports.subscribe = async (req, res) => {
    const { username, playfabId, playfabToken, subsname, email } = req.body
    const uniqueId = generateRandomString()
    const merchantId = process.env.merchantid
    const password = process.env.merchantpass

    let amount

    const usdrate = await Exchangerate.findOne({_id: process.env.exchangerate})
    .then(data => {
        return data.amount
    })

    await Subscription.findOne({subscriptionName: subsname})
    .then(data => {
        amount = data.amount * usdrate
    })

    const data = {
        "Amount": amount,
        "Currency": "PHP",
        "Description": `${subsname} Subcription`,
        "Email": email
    }

    const config = {
        method: 'post',
        url: `${DragonpayURL}/collect/v1/${uniqueId}/post`,
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
            playerPlayfabId: playfabId,
            subscriptionType: `${subsname} Subcription`,
            amount: amount,
            playfabToken: playfabToken
        })
        // console.log(item)
        res.json({message: "success", data: item.data})
    })
    .catch((error) => res.status(500).json({ error: error.message }));
}

exports.track = (req, res) => {
    const {refno} = req.body 
    AutoReceipt.findOne({ $or: [{orderCode: refno}, {receiptId: refno}]})
    .then(data => {
        if(data){
            const summary = {
                "transactionnumber": data.receiptId,
                "amount": data.amount,
                "status": data.status,
                "date": data.createdAt
            }
            res.json({message: "success", data: summary})
        } else {
            res.json({message: "failed", data: "Transaction not found"})
        }
    })
    .catch(err => {
        res.json({message: "failed", data: err})
    })
}

exports.createpayout = async (info) => {
    try {
        const { Amount, Email, MobileNo, FirstName, MiddleName, LastName, ProcDetail, ProcId , BirthDate, Nationality, Street1, Street2, Barangay, City, Province, Country, owner } = info
        
        const uniqueId = generateRandomString()
        const merchantId = process.env.merchantid
        const password = process.env.merchantpass
        const apiKey = process.env.merchantapi
        const currentDate = new Date();
        const dateString = currentDate.toDateString();

        const data = { 
            TxnId: uniqueId, 
            FirstName: FirstName,
            MiddleName: MiddleName,
            LastName: LastName,
            Amount: Amount,
            Currency: "PHP", 
            Description: "MML Payout",
            ProcId: ProcId, 
            ProcDetail: ProcDetail, // Account or mobile no of payout channel
            RunDate: dateString, 
            Email: Email, 
            MobileNo: MobileNo, 
            BirthDate: BirthDate, 
            Nationality: Nationality, 
            Address: {
                Street1: Street1, 
                Street2: Street2, 
                Barangay: Barangay, 
                City : City, 
                Province: Province, 
                Country: Country
            }
        }

        const config = {
            method: 'post',
            url: `${DragonpayURL}/payout/merchant/v1/${merchantId}/post`,
            headers: { 
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            data: data
        }

        const response = await axios(config);

        if (response.status === 200) {
            const item = await Dragonpayout.create(data);
            await Dragonpayout.findByIdAndUpdate(item._id, { Refno: response.data.Message, owner: owner });
            return 'success';
        } else {
            // Handle other status codes
            return 'failed';
        }
    } catch (error) {
        console.error(error);
        return 'failed';
    }
}
