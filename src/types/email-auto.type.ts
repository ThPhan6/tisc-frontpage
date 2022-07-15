export interface IEmailAutoRespondForm {
  topic: string;
  targeted_for: string;
  title: string;
  message: string;
}

// for topic and targeted-for list
export interface IEmailAutoRadioListProps {
  key: string;
  value: any;
}
