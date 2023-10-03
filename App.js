import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
// reusable button component

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function addFriendToFriendList(newFriend) {
    setFriendList((friendList) => [...friendList, newFriend]);
    setShowAddFriend((show) => !show);
  }

  function handleShowAddFriendFrom() {
    setShowAddFriend((show) => !show);
  }
  function handleSelection(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSplitBill(value){
    console.log(value);
    setFriendList((friends) => friends.map((friend) => friend.id === selectedFriend.id ? {...friend,balance: friend.balance + value} : friend))

    setSelectedFriend(null)
  }


  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendList={friendList}
          onFriendSelected={handleSelection}
          selectedFriend={selectedFriend}
        />
        {
          // showAddFriend ? <FormAddFriend /> : null
          showAddFriend && (
            <FormAddFriend onAddToFriendList={addFriendToFriendList} />
          )
        }
        <Button onClick={handleShowAddFriendFrom}>
          {showAddFriend ? "Close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && <FromSplitBill selectedFriend={selectedFriend} onSplitBill = {handleSplitBill} key={selectedFriend.id}/>}
    </div>
  );
}

// friend list component
function FriendsList({ friendList, onFriendSelected, selectedFriend }) {
  return (
    <ul>
      {friendList.map((friend) => {
        return (
          <Friend
            friend={friend}
            key={friend.id}
            onFriendSelected={onFriendSelected}
            selectedFriend={selectedFriend}
          />
        );
      })}
    </ul>
  );
}

function Friend({ friend, onFriendSelected, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  function handleFriendSelected() {
    onFriendSelected(friend);
  }
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name}
          {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even </p>}

      {/* {friend.balance < 0 ? (
        <p className="red">
          You owe {friend.name}
          {Math.abs(friend.balance)}
        </p>
      ) : friend.balance > 0 ? (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}
        </p>
      ) : (
        <p>You and {friend.name} are even </p>
      )} */}
      <Button onClick={handleFriendSelected}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

//  add friend form  component below

function FormAddFriend({ onAddToFriendList }) {
  const [friendName, setFriendName] = useState("");
  const [imageUrl, setImageURl] = useState("https://i.pravatar.cc/48");

  function handleSubmit(event) {
    event.preventDefault();

    if (!friendName || !imageUrl) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name: friendName,
      image: `${imageUrl}?=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    onAddToFriendList(newFriend);

    setFriendName("");
    setImageURl("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>Friend Name</label>
      <input
        type="text"
        value={friendName}
        onChange={(event) => setFriendName(event.target.value)}
      />

      <label>Image Url</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(event) => setImageURl(event.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FromSplitBill({ selectedFriend ,onSplitBill}) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : '';
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(event)
  {
    event.preventDefault();

    if(!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);

  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      ></input>

      <label>Your Expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) => setPaidByUser(Number(e.target.value) > bill ? paidByUser : Number(e.target.value))}
      ></input>

      <label>{selectedFriend.name}'s Expense</label>
      <input type="text" value={paidByFriend}disabled></input>

      <label>Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
