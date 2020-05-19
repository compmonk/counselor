import React from "react";
import {useState, useEffect} from "react";
import {Card, Button, Table} from "react-bootstrap";
import Page404 from "../others/FourZeroFour";
import "../../sass/App.css";
import axios from "axios";

function UserWallet() {
    const [balance, setBalance] = useState([]);
    let id = "";
    useEffect(() => {
        async function fetch() {
            let balance = await axios.get("/api/user/balance");
            console.log("wallet balance", balance.data);
            setBalance(balance.data);
        }

        fetch();
    }, []);

    if (!balance.length) return <Page404></Page404>;

    return (
        balance ?
            (
                <div className="container">
                    <Table striped bordered hover className="counselor-table">
                        <thead>
                        <tr>
                            <th>Currency</th>
                            <th>Balance</th>
                        </tr>
                        </thead>
                        <tbody>
                        {balance &&
                        balance.map((item, index) => {
                            return (
                                <tr key={index}>
                                    <td>
                                        {item.asset_type}
                                    </td>
                                    <td>{item.balance}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </Table>
                </div>
            ) : <div/>
    );
}

export default UserWallet;
