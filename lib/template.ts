export const EMAIL_VERIFICATION_TEMPLATE:string = 
`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px;
            color: #4a5568;
        }
        .button {
            display: inline-block;
            padding: 14px 28px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 500;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 12px;
            color: #a0aec0;
        }
        .highlight {
            background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 600;
        }
        .code {
            font-size: 32px;
            letter-spacing: 8px;
            color: #2d3748;
            font-weight: 700;
            text-align: center;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to <span class="highlight">Vidyastraa</span></h1>
            <p>Let's get you started</p>
        </div>
        
        <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thanks for signing up! Please verify your email address to activate your account and access all features.</p>
            
            <div style="text-align: center;">
                <a href="{{verification_url}}" class="button">Verify Email</a>
            </div>
            
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #4299e1;">{{verification_url}}</p>
            
            <p>This link will expire in <strong>12 hours</strong>.</p>
            <p>If you didn't create an account, please ignore this email.</p>
        </div>
        
        <div class="footer">
            <p>© 2025 Vidyastraa. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`


export const PASSWORD_RESET_TEMPLATE:string =
`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
            letter-spacing: 0.5px;
        }
        .header p {
            opacity: 0.9;
            margin: 8px 0 0;
        }
        .content {
            padding: 40px;
            color: #4a5568;
            line-height: 1.6;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 500;
            margin: 25px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        .footer {
            text-align: center;
            padding: 25px;
            font-size: 12px;
            color: #a0aec0;
            border-top: 1px solid #edf2f7;
        }
        .highlight {
            background: linear-gradient(120deg, #a3bffa 0%, #e9d8fd 100%);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            font-weight: 600;
        }
        .timer {
            font-size: 15px;
            color: #667eea;
            font-weight: 500;
            text-align: center;
            margin: 15px 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .timer svg {
            margin-right: 8px;
        }
        .url-box {
            background: #f8fafc;
            padding: 12px;
            border-radius: 8px;
            word-break: break-all;
            font-size: 14px;
            color: #4a5568;
            border: 1px solid #e2e8f0;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your <span class="highlight">Password</span></h1>
            <p>Secure your account with a new password</p>
        </div>
        
        <div class="content">
            <h2 style="margin-top: 0;">Hello!</h2>
            <p>You requested to reset your password. Click the button below to create a new secure password:</p>
            
            <div style="text-align: center;">
                <a href="{{reset_url}}" class="button">Reset Password</a>
            </div>
            
            <div class="timer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Link expires in 1 hour
            </div>
            
            <p>If the button doesn't work, copy and paste this URL into your browser:</p>
            <div class="url-box">{{reset_url}}</div>
            
            <p style="margin-bottom: 0;"><strong>Didn't request this?</strong><br>
            Ignore this email or <a href="mailto:info.vidyastraa@gmail.com" style="color: #667eea;">contact us</a> if you have questions.</p>
        </div>
        
        <div class="footer">
            <p>© 2025 Vidyastraa. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`