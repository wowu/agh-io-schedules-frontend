import { createRef } from 'react';

export interface DownloadFileButtonProps {
  filename: string;
  downloadHandler: Function;
  children: JSX.Element;
}

export function DownloadFileButton(props: DownloadFileButtonProps) {
  const link = createRef<any>();

  const handleAction = async () => {
    if (link.current.href) {
      return;
    }

    try {
      const blob = await props.downloadHandler();
      const href = window.URL.createObjectURL(blob);

      link.current.download = props.filename;
      link.current.href = href;

      link.current.click();
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <>
      <a role="button" ref={link} onClick={handleAction}>
        {props.children}
      </a>
    </>
  );
}
