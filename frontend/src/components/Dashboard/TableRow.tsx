const TableRow: React.FC<{
  id: string;
  customer: string;
  status: "Paid" | "Pending" | "Failed";
  amount: string;
}> = ({ id, customer, status, amount }) => {
  const statusColor =
    status === "Paid"
      ? "text-green-600"
      : status === "Pending"
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <tr className="border-t">
      <td className="px-4 py-2">{id}</td>
      <td className="px-4 py-2">{customer}</td>
      <td className={`px-4 py-2 font-medium ${statusColor}`}>
        {status}
      </td>
      <td className="px-4 py-2">{amount}</td>
    </tr>
  );
};

export default TableRow;