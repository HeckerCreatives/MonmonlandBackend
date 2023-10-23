var playfab = require('playfab-sdk')
require('dotenv').config();
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
var PlayFabAdmin = playfab.PlayFabAdmin
PlayFab.settings.titleId = process.env.monmontitleid;
PlayFab.settings.developerSecretKey = process.env.monmondeveloperkey;
exports.registration = async (req, res) => {
    const { username , password, phone, email, sponsor, token } = req.body;

    const playFabUserData = {
        TitleId: process.env.monmontitleid,
        Username: username,
        DisplayName: username,
        Password: password,
        Email: email
    };

    PlayFabClient.RegisterPlayFabUser(playFabUserData, (error, result) => {
        if(result){
            PlayFab._internalSettings.sessionTicket = result.data.SessionTicket;
            PlayFabClient.ExecuteCloudScript({
                FunctionName: "FinishRegistration",
                FunctionParameter: {
                    sponsor: sponsor,
                    phone: phone,
                    email: email,
                    playerUsername: username,
                },
                ExecuteCloudScript: true,
                GeneratePlayStreamEvent: true,
            }, async (error2, result2) => {
                if(result2.data.FunctionResult.message !== "success"){

                    PlayFabAdmin.DeleteMasterPlayerAccount({PlayFabId: result.data.PlayFabId}, (error3, result3) => {
                        if(result3){
                            res.json({message: "failed", data: "There is a problem in registration of your account please try again"})
                        } else if(error3) {
                            res.json({message: "Failed", data: error3.errorMessage})
                        }
                    })

                } else if (error2) {

                    PlayFabAdmin.DeleteMasterPlayerAccount({PlayFabId: result.data.PlayFabId}, (error3, result3) => {
                        if(result3){
                            res.json({message: "failed", data: "There is a problem in registration of your account please try again"})
                        } else if(error3) {
                            res.json({message: "Failed", data: error3.errorMessage})
                        }
                    })

                    res.json({message: "failed", data: error2.errorMessage})
                    
                } else {
                    res.json({message: "success"})
                }
            })

        } else if (error){
            res.json({message: "failed", data: error.errorMessage})
        }
    })

    // const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.Recaptcha_SECRET_KEY}&response=${token}`;

    // await fetch(url, {
    //     method: 'post',
    //     headers: {
    //         // "Accept": "application/json",
    //         "Content-Type": "application/json"
    //     }
    // })
    // .then(response => response.json())
    // .then(google_response => {
    //     console.log(google_response)
    //     console.log(token)
    //     if(google_response.hasOwnProperty("score")){
    //         if(google_response.score <= 0.5){
    //             return res.json({message: "failed", data: "please verify that you're a human"})
    //         } else {
                
    //         }
    //     } else {
    //         return res.json({message: "failed", data: "There's a problem with the server please try again later."})
    //     }
    // })
    // .catch(error => res.json({message: "failed", data: error }));
    
}