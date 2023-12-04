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
        "Currency": "PHP",
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
  // Assuming Request and Application objects are available in your context
  const txnid = request.body.txnid; // Adjust this according to your actual object structure
  const refno = request.body.refno; // Adjust this according to your actual object structure
  const status = request.body.status; // Adjust this according to your actual object structure
  const message = request.body.message; // Adjust this according to your actual object structure
  const receivedDigest = request.body.digest; // Adjust this according to your actual object structure
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
    AutoReceipt.findOne({receiptId: txnid})
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

        // if(status !== "partially_paid" && status !== "finished" && status !== "failed" && status !== "expired"){
           
        //     response.statusCode = 400;
        //     response.end(error_msg);
        //     return
        // }

        if(status === "F" || status === 'V'){
            AutoReceipt.findByIdAndUpdate(item._id, {status: "cancel", orderCode: refno})
            .then(()=> {
                response.statusCode = 200;
                response.end('OK');
                return
            })
            .catch(err => {
                response.statusCode = 400;
                response.end(err);
                return
            })
            return
        }

        // if(body.payment_status === "partially_paid"){
        //     item.amount = body.actually_paid
        // }

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
            console.log(result1)
            console.log(error1)
            if(result1.data.FunctionResult.message === "success"){
            AutoReceipt.findByIdAndUpdate(item._id, {status: "success", orderCode: refno}, {new: true})
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
      
    } else {
      // Handle other cases as needed
      console.log("Status is not 'SUCCESS'. Handle accordingly.");
      response.status(200).send("Payment verification successful. Status is not 'SUCCESS'.");
    }
  }
};

exports.createpayout = (req, res) => {
    const { Amount, Description, Email, MobileNo, FirstName, MiddleName, LastName, ProcDetail } = req.body
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
        Description: Description,
        ProcId: "CEBL", 
        ProcDetail: ProcDetail, // Account or mobile no of payout channel
        RunDate: dateString, 
        Email: Email, 
        MobileNo: MobileNo, 
        BirthDate: "1970-11-17", 
        Nationality: "Philippines", 
        Address:
        { Street1: "123 Sesame Street", 
        Street2: "Childrens Television Workshop", 
        Barangay: "Ugong", 
        City : "Pasig", 
        Province: "Metro Manila", 
        Country: "PH"
        }
    }


    const config = {
        method: 'post',
        url: `https://test.dragonpay.ph/api/payout/merchant/v1/${merchantId}/post`,
        headers: { 
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        data : data
    }
    // console.log("Dragonpay API Request:", config);
    axios(config)
    .then(async response => {
        if (response.status === 200) {
            await Dragonpayout.create(data)
            .then(item => {
                Dragonpayout.findByIdAndUpdate(item._id, {Refno: response.data.Message})
                .then((data) => {
                    res.json({ message: "success", data: response.data });
                })
                
            })
            
        } else {
            // Handle other status codes
            console.error(`Request failed with status code ${response.status}`);
            res.status(response.status).json({ error: response.statusText });
        }
    })
    .catch(error => res.status(500).json({ error: error }));

}

exports.verifypayout = (request, response) => {
    console.log(request)
    // Assuming Request and Application objects are available in your context
    const txnid = request.body.txnid; // Adjust this according to your actual object structure
    const refno = request.body.refno; // Adjust this according to your actual object structure
    const status = request.body.status; // Adjust this according to your actual object structure
    const message = request.body.message; // Adjust this according to your actual object structure
    const receivedDigest = request.body.digest; // Adjust this according to your actual object structure
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
              response.status(400).send("status is not pending");
              console.error("status is not pending");
              return
          }
  
          // if(status !== "partially_paid" && status !== "finished" && status !== "failed" && status !== "expired"){
             
          //     response.statusCode = 400;
          //     response.end(error_msg);
          //     return
          // }
  
          if(status === "F" || status === 'V'){
               Dragonpayout.findByIdAndUpdate(item._id, {Status: "cancel", Refno: refno})
              .then(()=> {
                  response.status(200).send('OK');
                  return
              })
              .catch(err => {
                  response.status(400).send(err);
                  console.error(err);
                  return
              })
              return
          }
  
          // if(body.payment_status === "partially_paid"){
          //     item.amount = body.actually_paid
          // }
  
    //       PlayFab._internalSettings.sessionTicket = item.playfabToken;
    //       PlayFabClient.ExecuteCloudScript({
    //           FunctionName: "Topup",
    //           FunctionParameter: {
    //           playerId: item.playerPlayfabId,
    //           topupAmount: item.amount,
    //           },
    //           ExecuteCloudScript: true,
    //           GeneratePlayStreamEvent: true,
    //       }, (error1, result1) => {
    //           console.log(result1)
    //           console.log(error1)
    //           if(result1.data.FunctionResult.message === "success"){
        Dragonpayout.findByIdAndUpdate(item._id, {Status: "success", Refno: refno}, {new: true})
              .then(() => {
                response.statusCode = 200;
                response.end('OK');
                return
              })
              .catch(err => {
                  response.status(400).send(err);
                  console.error(err);
                  return
              })
    //           } else {
    //               response.statusCode = 400;
    //               response.end(error_msg);
    //               return
    //           }
    //       })
    //   })
    //   .catch(err => {
    //       response.statusCode = 400;
    //       response.end(error_msg);
    //       return
      })
        
      } else {
        // Handle other cases as needed
        console.log("Status is not 'SUCCESS'. Handle accordingly.");
        response.status(200).send("Payment verification successful. Status is not 'SUCCESS'.");
      }
    }
  };