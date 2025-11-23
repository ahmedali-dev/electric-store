// check if user have token and code and expire date
                if (!user.is_active_code || user.is_active_code_token || !user.is_active_code_token_expire){
                    res.status(400).json({
                        success:false,
                        message: "Invalid Token or Code or Expired token"
                    })
                    return;
                }

                // check expire token
                const now = new Date(Date.now());
                if (user.is_active < now) {
                    res.status(400).json({
                        success:false,
                        message: "Token Expire"
                    })
                    return;
                }


                // valid token