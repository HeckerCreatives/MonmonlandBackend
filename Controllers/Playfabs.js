var playfab = require('playfab-sdk')
require('dotenv').config();
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
var PlayFabAdmin = playfab.PlayFabAdmin
PlayFab.settings.titleId = process.env.monmontitleid;
PlayFab.settings.developerSecretKey = process.env.monmondeveloperkey;
exports.registration = (req, res) => {
    const { username , password, phone, email, sponsor } = req.body;

    const playFabUserData = {
        TitleId: process.env.monmontitleid,
        Username: username,
        DisplayName: username,
        Password: password,
        Email: email
    };

    const login = {
        Username: username,            
        Password: password,  
    }

    PlayFabClient.RegisterPlayFabUser(playFabUserData, (error, result) => {
        if(result){
            
            PlayFabClient.LoginWithPlayFab(login, (error1, result1) => {
                
                if(result1){
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
                                    res.json({message: "failed", data: result2.data.FunctionResult.data})
                                } else if(error3) {
                                    res.json({message: "Failed", data: error3.errorMessage})
                                }
                            })

                        } else if (error2) {
                            res.json({message: "failed", data: error2.errorMessage})
                        } else {
                            res.json({message: "success"})
                        }
                    })
                } else if (error1) {
                    res.json({message: "failed", data: error1.errorMessage})
                }
            })

        } else if (error){
            res.json({message: "failed", data: error.errorMessage})
        }
    })
}