import React from "react";

type ListItemProps = {
  item: {
    activity: string;
    price: number;
    type: string;
    bookingRequired: boolean;
    accessibility: number;
  };
  onDelete: () => void; 
};

const ListItem: React.FC<ListItemProps> = ({ item, onDelete }) => {
  return (
    <div className="flex justify-between items-center border p-2 rounded">
      <div>
        <p className="font-semibold">{item.activity}</p>
        <p className="text-sm">Price: ${item.price}</p>
        <p className="text-sm">Type: {item.type}</p>
        <p className="text-sm">Booking: {item.bookingRequired ? "Yes" : "No"}</p>
        <p className="text-sm">Accessibility: {item.accessibility.toFixed(1)}</p>
      </div>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Delete
      </button>
    </div>
  );
};

export default ListItem;
