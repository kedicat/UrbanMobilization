import React from 'react'
import { Card, Button, Form, Input, Row, Col, Select } from 'antd'

/**
 * this demo uses EMQX Public MQTT Broker (https://www.emqx.com/en/mqtt/public-mqtt5-broker), here are the details:
 *
 * Broker host: broker.emqx.io
 * WebSocket port: 8083
 * WebSocket over TLS/SSL port: 8084
 */

const Connection = ({ connect, disconnect, connectBtn }) => {
  const [form] = Form.useForm()
  const initialConnectionOptions = {
    clientId: 'iTwin_AhmetEvyapan_' + Math.random().toString(16).substring(2, 8),
  }

  const onFinish = (values) => {
    const { clientId } = values
    const url = `ws://broker.emqx.io:8083/mqtt`
    const options = {
      clientId,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000, // ms
    }
    connect(url, options)
  }

  const handleConnect = () => {
    form.submit()
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const ConnectionForm = (
    <Form
      layout="vertical"
      name="basic"
      form={form}
      initialValues={initialConnectionOptions}
      onFinish={onFinish}
    >
      <Row gutter={20}>
        <Col span={8}>
          <Form.Item label="Client ID" name="clientId">
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )

  return (
    <Card
      title="Connection"
      actions={[
        <Button type="primary" onClick={handleConnect}>
          {connectBtn}
        </Button>,
        <Button danger onClick={handleDisconnect}>
          Disconnect
        </Button>,
      ]}
    >
      {ConnectionForm}
    </Card>
  )
}

export default Connection
