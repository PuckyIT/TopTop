import React from 'react';
import { Card, Row, Col, Typography } from 'antd';
import { useAbility } from '@/app/context/AbilityContext';

const { Paragraph } = Typography;

const ACLPage: React.FC = () => {
  const ability = useAbility();

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="Common">
          <Paragraph>No special ability is required to view this card.</Paragraph>
          <Paragraph>This card is visible to all roles: guest, user, and admin.</Paragraph>
        </Card>
      </Col>
      {ability.can('read', 'Analytics') && ( 
        <Col span={12}>
          <Card title="Analytics">
            <Paragraph>User with Analytics subject Read ability can view this card.</Paragraph>
            <Paragraph>This card is visible to the admin role only.</Paragraph>
          </Card>
        </Col>
      )}
    </Row>
  );
};

export default ACLPage;