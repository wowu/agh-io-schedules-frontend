import { Card, Button, Elevation } from '@blueprintjs/core';

export default function Schedules() {
  return (
    <>
      <Card interactive={true} elevation={Elevation.TWO}>
        <h5>
          <a href="#">Card heading</a>
        </h5>
        <p>Card content</p>
        <Button>Submit</Button>
      </Card>
    </>
  );
}
