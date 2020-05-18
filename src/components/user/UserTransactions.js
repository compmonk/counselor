import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";

function UserTransactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const transactions = await axios.get(
        "/api/user/transactions"
      );
      console.log(transactions);
      setTransactions(transactions.data);
    }
    fetchData();
  }, []);
  return (
    <div className="flex-sm row">
      <div className="col-sm-8 col-md-8 col-lg-8">
        <Table striped bordered hover className="counselor-table">
          <thead>
            <tr>
              <th>Created Time</th>
              <th>Fees Charged</th>
              <th>Transaction ID</th>
              <th>Source Account</th>
              <th>Was Successful?</th>
              <th>Valid After</th>
              <th>Expiration Time</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.created_at}</td>
                <td>{tx.fee_charged ? tx.fee_charged : "NA"}</td>
                <td>{tx.id}</td>
                <td>{tx.source_account}</td>
                <td>{tx.successful ? "True" : "False"}</td>
                <td>{tx.valid_after ? tx.valid_after : "NA"}</td>
                <td>{tx.expirationTime ? tx.expirationTime : "NA"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default UserTransactions;
