import React, { useEffect, useState } from 'react';
import { Card, List } from 'antd';

const Receiver = ({ payload }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (payload.topic) {
      const gpsStuff = JSON.parse(payload.message);
      const gps = gpsStuff.GPS;
      const newPayload = {
        topic: payload.topic,
        message: gps,
      };

      console.log('GPS:', gps);
      setMessages((messages) => [...messages, newPayload]);
    }
  }, [payload]);

  const renderListItem = (item) => {
    const { Altitude, Latitude, Longitude } = item.message || {}; // Destructure properties

    return (
      <List.Item>
        <List.Item.Meta
          title={item.topic}
          description={`Altitude: ${Altitude}, Latitude: ${Latitude}, Longitude: ${Longitude}`}
        />
      </List.Item>
    );
  };

  return (
    <Card title="Receiver">
      <List size="small" bordered dataSource={messages} renderItem={renderListItem} />
    </Card>
  );
};

export default Receiver;
