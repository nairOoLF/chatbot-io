// src/pages/Home.js
import React, { useState } from 'react';
import BotList from '../components/botList';
import Chat from '../components/chat';

const Home = () => {
  const [selectedBot, setSelectedBot] = useState(null);

  return (
    <div className="home-container">
      <BotList onSelectBot={setSelectedBot} />
      {selectedBot && <Chat bot={selectedBot} />}
    </div>
  );
};

export default Home;
