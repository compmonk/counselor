import React from "react";

const Home = () => {
    return (
        <div>
            <div className="container-fluid counselor-box">
                <h1>Welcome to Coulselor!</h1>
                <p>Your 24*7 homework help portal</p>
                <h1>Got Stuck?</h1>
                <p>We have got your back. Get onboarded and start looking for the exact article. Don’t worry about the
                    genuineness of the articles. We have got it covered.</p>
                <h1>Why Counselor?</h1>
                <p>Unlike our competitors like coursehero or chegg where students upload assignments which are not
                    verified.
                    Sometimes they upload random documents just to get unlocks. But we verify the genuineness of our
                    articles from the canvas. Get automatic recommendations based on your course enrollments. Wanna get
                    a
                    premium subscription? Sure why not you can just make the payment in the currency of your choice.
                    Just go
                    to your stellar account and add balance. Get points for publishing articles.</p>
                <h1>Planned Updates</h1>
                <p>Displaying score of the article from canvas</p>
            </div>
            <div align="center" className="col-mb-4">
                <div>
                    <img
                        src="https://assets-global.website-files.com/5deac75ecad2173c2ccccbc7/5dec8960504967fd31147f62_Stellar_lockup_black_RGB.svg"
                        height="100"
                        width="100"
                        alt="Stellar Logo"
                    />
                </div>
                <div>
                    <img
                        src="https://alpineschools.org/wp-content/uploads/2018/04/Canvas-Logo.png"
                        height="50"
                        width="100"
                        alt="Canvas Logo"
                    />
                </div>
            </div>
        </div>

    )
}

export default Home;