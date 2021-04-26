import ReactJson from 'react-json-view';

export default function EventDetails(props: any) {
  return <ReactJson src={props.event} />;
}
