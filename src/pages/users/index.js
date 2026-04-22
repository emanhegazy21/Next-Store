import React from "react";
import { getAllUsers } from "@/lib/dbConnect";

const UsersPage = ({ users }) => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-2">Users</h1>
        <p className="text-muted">Simple users page, closer to the folder shape you sent.</p>
      </div>

      <div className="row g-4">
        {users.map((user) => (
          <div key={user.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-4">
                <h2 className="h5 fw-bold mb-1">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted small mb-2">{user.email}</p>
                <div className="small text-muted mb-1">Role: {user.role}</div>
                <div className="small text-muted mb-1">Phone: {user.phone || "N/A"}</div>
                <div className="small text-muted">City: {user.city || "N/A"}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersPage;

export async function getStaticProps() {
  return {
    props: {
      users: await getAllUsers(),
    },
    revalidate: 30,
  };
}
