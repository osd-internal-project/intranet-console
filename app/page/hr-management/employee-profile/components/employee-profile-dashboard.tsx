import { Card } from "antd";
import React from "react";
import { cardTableHrDashboard } from "../common";

export interface props {
  dataSourceDashboard: { active: number; inactive: number; new: number; status: string; total: number };
}

const EmployeeProfileDashboard: React.FC<props> = ({ dataSourceDashboard }): React.ReactElement => {
  return (
    <div className="grid col-span-3 grid-cols-4 space-x-8">
      <div>
        <Card>{cardTableHrDashboard("total", dataSourceDashboard.total)}</Card>
      </div>
      <div>
        <Card>{cardTableHrDashboard("active", dataSourceDashboard.active)}</Card>
      </div>
      <div>
        <Card>{cardTableHrDashboard("inactive", dataSourceDashboard.inactive)}</Card>
      </div>
      <div>
        <Card>{cardTableHrDashboard("new", dataSourceDashboard.new)}</Card>
      </div>
    </div>
  );
};

export default EmployeeProfileDashboard;
