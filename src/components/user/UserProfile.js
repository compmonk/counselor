import React from "react";
import { useState, useEffect } from "react";
import { Card, Button, Table } from "react-bootstrap";
import Page404 from "../FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState({});
  let id = "";
  useEffect(() => {
    async function fetch() {
      let person = await axios.get("api/user/5eb9bb4afda1a60b18bc8040");
      console.log(person);
      setProfile(person.data);
    }
    fetch();
  }, []);

  if (!profile) return <Page404></Page404>;

  return (
    (
      <div className="row justify-content-center" style={{ paddingTop: "5%" }}>
        <div className="col-sm-8 col-md-8 col-lg-8">
          <Card>
            {/* <Card.Img variant="top" src={profilePic} style={{width:"auto", align:"center"}}/> */}
            <Card.Body>
              <Card.Title>
                {profile.firstName} {profile.lastName}
              </Card.Title>
              <Card.Title>{profile.email}</Card.Title>
              <Card.Title> Public Key: {profile.publicKey}</Card.Title>
              <Card.Title> Balance: {profile.balance}</Card.Title>

              <Card.Text>Canvas User Id: {profile.canvasUserId}</Card.Text>

              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Published</th>
                  </tr>
                </thead>
                <tbody>
                  {profile &&
                    profile.published &&
                    profile.published.map((reward, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            Article ID: {reward.articleId} reward :{reward.cost}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Purchased</th>
                  </tr>
                </thead>
                <tbody>
                  {profile &&
                    profile.purchased &&
                    profile.purchased.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            Article ID: {item.articleId} reward :{item.cost}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    ) || "No Data"
  );
}
export default UserProfile;
