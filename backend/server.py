import secrets
import asyncio
from requests import request
import requests
from fastapi.responses import RedirectResponse
from fastapi import datastructures, BackgroundTasks
from h11._abnf import status_code
from typing import Dict
from fastapi import FastAPI, Body, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from smtplib import SMTP_SSL
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import secrets
from datetime import datetime, timezone, timedelta
# pyrefly: ignore [missing-import]
from argon2.exceptions import VerifyMismatchError
from dotenv import load_dotenv  
import os
# pyrefly: ignore [missing-import]
from argon2 import PasswordHasher


load_dotenv()
app = FastAPI()

connectdb = AsyncIOMotorClient(os.getenv("MONGO_URL"))

db = connectdb["googlecracker"]

userdb = db["user"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.76.14:5173",
        "http://10.20.16.126:5173",
        "https://google-cracker-new.vercel.app",
        "https://g-crack-iota.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def delete_unverified_account(email: str):
    """Wait 5 minutes, then delete the user if OTP was never verified."""
    await asyncio.sleep(5 * 60) 
    user = await userdb.find_one({"email": email})
    if user and "otp" in user:
      
        await userdb.delete_one({"email": email})


@app.get("/")
def home():
    try:
        return {"message": "Google Cracker"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/registerinpage")
async def register(data: dict, background_tasks: BackgroundTasks):
    try:
        print("register called")
        user = await userdb.find_one({"email": data["email"]})
        if user:
            raise HTTPException(
                status_code=404,
                detail="User already exists"
            )
        else:
            otp = "".join(secrets.choice("0123456789")for i in range(6))
            
            html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }}
        .container {{
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .otp {{
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 5px;
            margin: 20px 0;
        }}
        .footer {{
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification</h2>

        <p>Your One-Time Password (OTP) is:</p>

        <div class="otp">{otp}</div>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p>If you didn't request this code, you can safely ignore this email.</p>

        <div class="footer">
            © 2026 Your Company
        </div>
    </div>
</body>
</html>
"""
            sender_email = "futrio.devs.ai@gmail.com"
            receiver_email = data["email"]
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver_email
            message["Subject"] = "Your Verification OTP"
            text = MIMEText(html, "html")
            message.attach(text)
            try:
                with SMTP_SSL("smtp.gmail.com", 465) as smtp:
                    smtp.login(sender_email, os.getenv("play_pass"))
                    smtp.sendmail(sender_email, receiver_email, message.as_string())
            except Exception as smtp_err:
                if os.getenv("ENV") == "production":
                    raise HTTPException(status_code=500, detail=str(smtp_err))
             
            ph = PasswordHasher()
            hashed = ph.hash(data["password"])
            hashed_otp = ph.hash(otp)
            await userdb.insert_one({
                "name": data["name"],
                "email": data["email"],
                "github_username": data["github_name"].lower(),
                "password": hashed,
                "role": "student",
                "last_login": datetime.now(timezone.utc),
                "otp" : hashed_otp,
                "otp_last_created" : datetime.now(timezone.utc), 
                "xp_scores" : 0,
                "joined_date" : datetime.now(timezone.utc)  
            })

            background_tasks.add_task(delete_unverified_account, data["email"])

        return {"message": "User registered successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/verifyotp")
async def verify_otp(data: dict):
    try:
        email = data.get("email")
        otp_val = str(data.get("otp_", "")).strip()
        if not email or not otp_val:
            raise HTTPException(
                status_code=400,
                detail="Email and OTP are required"
            )

        ph = PasswordHasher()
        user = await userdb.find_one({"email": email})
        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User Not Found"
            )   
        else:
          
            try:
                ph.verify(user["otp"], otp_val)
                print(f"[DEBUG] ph.verify PASSED")
                otp_created = user.get("otp_last_created")
                if otp_created:
                    if otp_created.tzinfo is None:
                        otp_created = otp_created.replace(tzinfo=timezone.utc)
                    elapsed = datetime.now(timezone.utc) - otp_created
                
                    if elapsed > timedelta(minutes=5):
                     
                        raise HTTPException(
                            status_code=401,
                            detail="OTP Expired"
                        )
                
                await userdb.update_one(
                    {"email": email},
                    {"$unset": {"otp": "", "otp_last_created": ""}}
                )
                return {"message": "OTP verified successfully"}
            except VerifyMismatchError:
        
                raise HTTPException(
                    status_code=401,
                    detail="Invalid OTP"
                )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/otp/request/again")
async def request_otp_again(data: dict):
    try:
        email = data.get("email")
        if not email:
            raise HTTPException(
                status_code=400,
                detail="Email is required"
            )
        
        user = await userdb.find_one({"email": email})
        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User Not Found"
            )
        else:
            otp = "".join(secrets.choice("0123456789")for i in range(6))
            
            html = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            padding: 20px;
        }}
        .container {{
            max-width: 500px;
            margin: auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        .otp {{
            font-size: 32px;
            font-weight: bold;
            color: #2563eb;
            letter-spacing: 5px;
            margin: 20px 0;
        }}
        .footer {{
            color: #666;
            font-size: 12px;
            margin-top: 20px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h2>Email Verification</h2>

        <p>Your One-Time Password (OTP) is:</p>

        <div class="otp">{otp}</div>

        <p>This OTP is valid for <strong>5 minutes</strong>.</p>

        <p>If you didn't request this code, you can safely ignore this email.</p>

        <div class="footer">
            © 2026 Your Company
        </div>
    </div>
</body>
</html>
"""
            sender_email = "futrio.devs.ai@gmail.com"
            receiver_email = data["email"]
            message = MIMEMultipart()
            message["From"] = sender_email
            message["To"] = receiver_email
            message["Subject"] = "Your Verification OTP"
            text = MIMEText(html, "html")
            message.attach(text)
            try:
                with SMTP_SSL("smtp.gmail.com", 465) as smtp:
                    smtp.login(sender_email, os.getenv("play_pass"))
                    smtp.sendmail(sender_email, receiver_email, message.as_string())
            except Exception as smtp_err:
                if os.getenv("ENV") == "production":
                    raise HTTPException(status_code=500, detail=str(smtp_err))
               
            ph = PasswordHasher()
            hashed_otp = ph.hash(otp)
            await userdb.update_one(
                {"email":email},
                {"$set": {"otp": hashed_otp, "otp_last_created": datetime.now(timezone.utc)}}
            )
            return {"message": "OTP sent successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/logininpage")
async def login(data: dict):
    try:
        user = await userdb.find_one({"email": data["email"]})

        if user is None:
            raise HTTPException(status_code=404, detail="User Not Found")

        # ── Verify password first ──
        try:
            ph = PasswordHasher()
            ph.verify(user["password"], data["password"])
        except VerifyMismatchError:
            raise HTTPException(status_code=401, detail="Invalid password")

        # ── Daily check-in logic ──
        today = datetime.now(timezone.utc).date()
        last_login_date = user.get("last_login")
        is_new_day = (last_login_date is None) or (last_login_date.date() != today)

        update_fields = {"last_login": datetime.now(timezone.utc)}
        checkin_awarded = False

        if is_new_day:
            # Reset daily solved question counter
            update_fields["last_solved_question"] = 0
            # Award daily check-in XP only once per day
            current_xp = user.get("xp_scores", 0)
            update_fields["xp_scores"] = current_xp + 10
            checkin_awarded = True

        await userdb.update_one(
            {"email": data["email"]},
            {"$set": update_fields}
        )

        return {
            "message": "Login successful",
            "checkin_awarded": checkin_awarded
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AUTH_ERR [500]: {str(e)}"
        )

@app.get("/getrole")
async def get_role(email: str):
    try:
        user = await userdb.find_one({"email": email})
        if user:
            return {"role": user["role"]}
        else:
            raise HTTPException(
                status_code=404,
                detail="User Not Found"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get/user")
async def get_user_profile(email: str):
    try:
        user = await userdb.find_one({"email": email})
        if user:
            return {
                "name": user.get("name", "Candidate"),
                "email": user.get("email", email),
                "github_username": user.get("github_username", ""),
                "role": user.get("role", "student"),
                "xp_scores": user.get("xp_scores", 0)
            }
        else:
            raise HTTPException(status_code=404, detail="User Not Found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


dailyques_db = db["dailyques"]
weeklyques_db = db["weeklyques"]

@app.post("/dailyques")
async def add_daily_ques(data: dict):
    try:
        title = data["title"].strip()
        link = data["link"].strip()
        difficulty = data.get("difficulty", "medium").strip()
        await dailyques_db.update_one(
            {
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "$push": {
                    "questions": {
                        "title": title,
                        "link": link,
                        "difficulty": difficulty
                    }
                }
            },
            upsert=True
        )
        return {"message": "Daily question added successfully", "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/dailyques")
async def delete_daily_ques(data: dict):
    try:
        title = data["title"].strip()
        today = datetime.now().strftime("%Y-%m-%d")
        result = await dailyques_db.update_one(
            {"date": today},
            {"$pull": {"questions": {"title": title}}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Question not found for today")
        return {"message": "Daily question deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/weeklyques")
async def add_weekly_ques(data: dict):
    try:
        title = data["title"].strip()
        link = data["link"].strip()
        difficulty = data.get("difficulty", "medium").strip()
        await weeklyques_db.update_one(
            {
                "date": datetime.now().strftime("%Y-%m-%d")
            },
            {
                "$push": {
                    "questions": {
                        "title": title,
                        "link": link,
                        "difficulty": difficulty
                    }
                }
            },
            upsert=True
        )
        return {"message": "Weekly question added successfully", "data": data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/weeklyques")
async def delete_weekly_ques(data: dict):
    try:
        title = data["title"].strip()
        today = datetime.now().strftime("%Y-%m-%d")
        result = await weeklyques_db.update_one(
            {"date": today},
            {"$pull": {"questions": {"title": title}}}
        )
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Question not found for this week")
        return {"message": "Weekly question deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/getdailyques")
async def get_daily_ques(date: str):
    try:
        ques = await dailyques_db.find_one(
            {
                "date": date
            }
        )
        if ques:
            questions = ques.get("questions", [])
            return {"data": questions}
        else:
            return {"data": []}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        

@app.get("/getweeklyques")
async def get_weekly_ques(date: str):
    try:
        ques = await weeklyques_db.find_one(
            {
                "date": date
            }
        )
        if ques:
            questions = ques.get("questions", [])
            return {"data": questions}
        else:
            return {"data": []}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/login/github")
async def github_login():
    github_client_id = os.getenv("github_client_id")
    github_client_secret = os.getenv("github_client_secret")
    CALLBACK_URL = "https://g-crack.onrender.com/auth/github/callback"
    github_url = (
        "https://github.com/login/oauth/authorize"
        f"?client_id={github_client_id}"
        f"&redirect_uri={CALLBACK_URL}"
        "&scope=repo"
    )
    return RedirectResponse(github_url)

@app.get("/auth/github/callback")
async def github_callback(code: str):
    response = requests.post(
        "https://github.com/login/oauth/access_token",
    data = {
            "client_id": os.getenv("github_client_id"),
            "client_secret": os.getenv("github_client_secret"),
            "code": code
        },
        headers={
            "Accept": "application/json"
        }
    )
    token = response.json()["access_token"]
    user_details = requests.get(
        "https://api.github.com/user",
        headers={
            "Authorization": f"token {token}",      
            "Accept": "application/json"
        }
    )
    data = user_details.json()
    
    github_user = data.get("login",None)
    await userdb.update_one(
        {"github_username": github_user},
        {"$set": {"github_token": token}}
    )
    return RedirectResponse(url="https://g-crack-jslo.onrender.com/sprint")

@app.get("/get/commits")
async def get_commits(email :str):
    try:
        user = await userdb.find_one({"email": email})
        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User Not Found"
            )
        else:
            user_name = user["github_username"]
            token = user["github_token"]
            url = f"https://api.github.com/repos/{user_name}/google_cracker/commits"
    
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/check/github/access")
async def check_github_access(email: str):
    try:
        user = await userdb.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")      
        else:
            token = user.get("github_token", None) 
            if not token:
                return {"authorize": False}
            else:
                return {"authorize": True}        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/check/commit/github")
async def check_commit_github(email: str):
    user = await userdb.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    else:
        user_name = user["github_username"]
        token = user["github_token"]
        url = f"https://api.github.com/users/{user_name}/repos"
        response = requests.get(
            url,
            headers={
                "Accept" : "application/vnd.github+json",
                "Authorization" : f"token {token}"
            },
            params={"sort" : "pushed","direction" : "desc", "per_page": 1}
        )
        data = response.json()
        if not data:
            return {"solved": False}
        top_repo = data[0]["name"]
        commit_url = f"https://api.github.com/repos/{user_name}/{top_repo}/commits"
        commit_response = requests.get(
            commit_url,
            headers={
                "Accept" : "application/vnd.github+json",
                "Authorization" : f"token {token}"
            },
            params={"per_page" : 1}
        )
        commit_data = commit_response.json()
      
        if not commit_data:
            return {
                "solved" : False
            }
        user = await userdb.find_one({"github_username" : user_name})
        last_solved_question = user.get("last_solved_question", 0)
        commit_date = commit_data[0]["commit"]["author"]["date"]    
        if datetime.fromisoformat(commit_date.replace("Z", "+00:00")).date() == datetime.now(timezone.utc).date() and abs(datetime.now(timezone.utc) - datetime.fromisoformat(commit_date.replace("Z", "+00:00"))) <= timedelta(minutes=1.5):
            await userdb.update_one(
                {"github_username" : user_name},
                {
                    "$set" : {
                        "last_solved_question" : last_solved_question + 1
                    }
                }
                
            )
            return {
                "solved" : True,
                "last_solved_question" : last_solved_question + 1
            }
        else:
            return {
                "solved" : False
            }
    
        
@app.get("/get/last/solved/ques")
async def get_last_solved_ques(email: str):
    try:
        user = await userdb.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        else:
            return {
                "last_solved_question" : user.get("last_solved_question", 0)
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/latest/file/changes")
async def latest_file_changes(email: str):
    try:
        user = await userdb.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        user_name = user.get("github_username")
        token = user.get("github_token")
        points = user.get("xp_scores",0)

        if not user_name or not token:
            raise HTTPException(status_code=400, detail="GitHub profile not connected. Please connect GitHub first.")

        url1 = f"https://api.github.com/users/{user_name}/repos"
        response1 = requests.get(
            url1,
            headers = {
                "Accept" : "application/vnd.github+json",
                "Authorization" : f"token {token}"
            },
            params = {
                "sort" : "pushed",
                "direction" : "desc",
                "per_page" : 10
            }
        )
        
        if response1.status_code != 200:
            raise HTTPException(status_code=response1.status_code, detail=f"GitHub API returned error: {response1.text}")
            
        repo_data = response1.json()
        if not isinstance(repo_data, list):
            raise HTTPException(status_code=500, detail="Invalid repos response format from GitHub API")

        top_repo = None
        for i in repo_data:
            repo_name = i.get("name","")
            if not any(word in repo_name.lower() for word in ("leet", "problems", "leetcode")):
                if repo_name.lower() != "google_cracker" and repo_name.lower() != "leetcode":
                    top_repo = repo_name
                    break
    
        if not top_repo:
            return {
                "project_done" : False,
                "message": "No active repositories found (excluding google_cracker and leetcode)"
            }

        url2 = f"https://api.github.com/repos/{user_name}/{top_repo}/commits"
        response2 = requests.get(
            url2,
            headers = {
                "Accept" : "application/vnd.github+json",
                "Authorization" : f"token {token}"
            },
            params = {
                "per_page" : 1
            }
        )
        
        if response2.status_code != 200:
            raise HTTPException(status_code=response2.status_code, detail=f"GitHub API returned error for commits: {response2.text}")
            
        commit_data = response2.json()
        if not commit_data or not isinstance(commit_data, list):
            return {
                "project_done" : False,
                "message": "No commits found in the repository"
            }
            
        sha = commit_data[0].get("sha")
        if not sha:
            return {
                "project_done": False,
                "message": "Latest commit SHA not found"
            }

        url3 = f"https://api.github.com/repos/{user_name}/{top_repo}/commits/{sha}"
        response3 = requests.get(
            url3,
            headers = {
                "Accept" : "application/vnd.github+json",
                "Authorization" : f"token {token}"
            }
        )
        
        if response3.status_code != 200:
            raise HTTPException(status_code=response3.status_code, detail=f"GitHub API returned error for commit details: {response3.text}")
            
        commit_history = response3.json()
        if not commit_history or "stats" not in commit_history:
            return {                                                                
                "project_done" : False,
                "message": "No change stats found in the latest commit"
            }
            
        total = commit_history["stats"].get("total", 0)
        last_commit_date = user.get("last_commit",None)
        if last_commit_date == None:   
            if total >= 50:
                await userdb.update_one(
                        {
                            "email": email
                        },
                        {
                            "$set": {
                                "last_commit": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"),
                                "xp_scores" : points + 100
                            }
                        }
                    )
                return {
                    "project_done" : True,
                    "total_changes": total
                }
            else:
                return {
                    "project_done" : False,
                    "total_changes": total,
                    "message": f"Only {total} changes detected. Minimum requirement is 50."
                }
        else:
            last_commit_date = datetime.fromisoformat(last_commit_date.replace("Z", "+00:00")).date()
            if datetime.now().date() - last_commit_date == timedelta(days=1):
                if total >= 50:
                    await userdb.update_one(
                        {
                            "email": email
                        },
                        {
                            "$set": {
                                "last_commit": datetime.now().strftime("%Y-%m-%dT%H:%M:%SZ"),
                                "xp_scores" : points + 100
                            }
                        }
                    )

                    return {
                        "project_done" : True,
                        "total_changes": total
                    }

                else:
                    return {
                        "project_done" : False,
                        "total_changes": total,
                        "message": f"Only {total} changes detected. Minimum requirement is 50."
                    }
            else:
                return {
                    "project_done" : False,
                    "total_changes": total,
                    "message": f"Your last commit was {datetime.now().date() - last_commit_date}. Minimum requirement is 1 day."
                }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/update/xp_scores")
async def update_xp_scores(data : dict):
    try:
        user = await userdb.find_one({
            "email": data["email"]
        })
        if not user:
            raise HTTPException(
                status_code=404,
                detail="User Not Found"
            )
        else:
            points = data["xp_scores"]
            user_points = user.get("xp_scores")
            if user_points is None:
                user_points = 0
            total = points + user_points
            await userdb.update_one(
                {
                    "email" : data["email"]
                },
                {
                    "$set" : {
                        "xp_scores" : total
                    }
                }
                               
            )
            return {
                "current_points" : total
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get/xp_scores")
async def get_xp_scores(email: str):
    try:
        user = await userdb.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User Not Found")
        xp_scores = user.get("xp_scores")
        if xp_scores is None:
            xp_scores = 0
        return {
            "xp_scores": xp_scores
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get/usersforrank")
async def get_users_for_rank():
    try:
        users = await userdb.find({}).to_list(length=100)
        res = []
        for user in users:
            xp = user.get("xp_scores")
            if xp is None:
                xp = 0
            temp = {
                "name": user.get("name"),
                "xp": xp,
                "email": user.get("email")
            }
            res.append(temp)
        res.sort(key=lambda x: x["xp"], reverse=True)
        return res
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
       
        
            
@app.get("/userprofile")
async def user_profile(email : str):
    try:
        user = await userdb.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User Not Found")
        return {
            "name": user.get("name"),
            "xp": user.get("xp_scores"),
            "email": user.get("email"),
            "github_username": user.get("github_username"),
            "joined_date": user.get("joined_date"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/latest/file/changes")
async def latest_file_changes(data : dict):
    try:
        user = await userdb.find_one(
            {
                "email" : data["email"]
            },
        )
        user_name = user.get("github_username")
        token = user.get("github_token")
        url = f"https://api.github.com/users/{user_name}/repos"
        response = requests.get(
            url,
            headers={
                "Accept" : "application/vnd.github+json",
                "Authorization" : f"token {token}",
            },
            params={"sort" : "pushed", "direction" : "desc", "per_page" : 1}
        )
        all_repo = response.json()
        top_repo = all_repo[0]["name"]
        url_commit = f"https://api.github.com/repos/{user_name}/{top_repo}/commits"
        if not all_repo:
            raise HTTPException(status_code=404, detail="User not found")   
        else:
            return {
                "project_done" : True
            }
    except Exception as e:
        raise HTTPException(status_code=404,detail = f"Error : {e}")



