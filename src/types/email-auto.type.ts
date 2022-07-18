export interface EmailTemplate {
  topic: string;
  targeted_for: string;
  title: string;
  message: string;
}

// for topic and targeted-for list
export interface RadioItem {
  key: string;
  value: any;
}
