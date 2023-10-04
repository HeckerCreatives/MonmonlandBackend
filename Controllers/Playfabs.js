var playfab = require('playfab-sdk')
var PlayFab = playfab.PlayFab
var PlayFabClient = playfab.PlayFabClient
PlayFab.settings.titleId = "307E3";

exports.registration = (req, res) => {
    const { username , password, phone, email, sponsor } = req.body;

    const playFabUserData = {
        TitleId: "307E3",
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
                        if(result2){
                            res.json({message: "success"})
                        } else if (error1) {
                            res.json({message: "failed", data: error2.errorMessage})
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