import { EntryFormWrapper } from '@/components/EntryForm';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { CustomInputEditor } from '@/components/Form/InputEditor';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove.svg';
import styles from '../styles/EmailAutorespondersEntryForm.less';
import { IEmailAutoRadioListProps, IEmailAutoRespondForm } from '@/types';
import React, { FC } from 'react';
import { CustomRadio } from '@/components/CustomRadio';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';
import { useDrag } from '../utils/useDrag';

interface EmailAutoRespondProps {
  value: IEmailAutoRespondForm;
  onChange: (value: IEmailAutoRespondForm) => void;
  onCancel: () => void;
  onSubmit: (data: IEmailAutoRespondForm) => void;
  submitButtonStatus: boolean;
  topicList: IEmailAutoRadioListProps[];
  targetedForList: IEmailAutoRadioListProps[];
}

export const EmailAutoRespondEntryForm: FC<EmailAutoRespondProps> = ({
  value,
  onChange,
  onCancel,
  onSubmit,
  submitButtonStatus,
  topicList,
  targetedForList,
}) => {
  /// for dragging radio item
  const { dragStart, dragStop, onWheel, handleDrag } = useDrag();

  const handleOnChangeTitleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, title: e.target.value });
  };
  const handleRemoveTitleInput = () => {
    onChange({ ...value, title: '' });
  };

  /// only get content entered
  const handleOnChangeMessageInput = (html: string) => {
    onChange({ ...value, message: html });
  };

  const handleOnChangeRadio = (
    typeRadio: 'topic' | 'targeted_for',
    valueRadio: string | number,
  ) => {
    onChange({
      ...value,
      [typeRadio]: valueRadio,
    });
  };

  const handleSubmitData = () => {
    onSubmit(value);
  };

  return (
    <div className={styles.container}>
      <EntryFormWrapper
        handleCancel={onCancel}
        handleSubmit={handleSubmitData}
        submitButtonStatus={submitButtonStatus}
      >
        {/* Topic */}
        <FormGroup label="Topic" required={true} layout="vertical" formClass={styles.radio_form}>
          <div onMouseLeave={() => dragStop}>
            <ScrollMenu
              onWheel={onWheel}
              onMouseDown={() => dragStart}
              onMouseMove={handleDrag}
              onMouseUp={() => dragStop}
            >
              {topicList.map((item) => (
                <CustomRadio
                  direction="horizontal"
                  value={value.topic}
                  onChange={(radioValue) => handleOnChangeRadio('topic', radioValue.value)}
                  options={[{ value: item.value, label: item.key }]}
                  containerClass={styles.radio_container}
                  key={item.value}
                />
              ))}
            </ScrollMenu>
          </div>
        </FormGroup>

        {/* Targeted For */}
        <FormGroup
          label="Targeted For"
          required={true}
          layout="vertical"
          formClass={styles.radio_form}
        >
          <div onMouseLeave={() => dragStop}>
            <ScrollMenu
              onWheel={onWheel}
              onMouseDown={() => dragStart}
              onMouseMove={handleDrag}
              onMouseUp={() => dragStop}
            >
              {targetedForList.map((item) => (
                <CustomRadio
                  key={item.value}
                  direction="horizontal"
                  value={value.targeted_for}
                  onChange={(radioValue) => handleOnChangeRadio('targeted_for', radioValue.value)}
                  options={[{ value: item.value, label: item.key }]}
                  containerClass={styles.radio_container}
                />
              ))}
            </ScrollMenu>
          </div>
        </FormGroup>

        {/* Title */}
        <FormGroup label="Title" required={true} layout="vertical" formClass={styles.title}>
          <div className={styles.title_field}>
            <CustomInput
              borderBottomColor="mono-medium"
              placeholder="message title"
              onChange={handleOnChangeTitleInput}
              value={value.title}
              className={value.title && styles.title_input}
            />
            {value.title && (
              <ActionRemoveIcon className={styles.remove_icon} onClick={handleRemoveTitleInput} />
            )}
          </div>
        </FormGroup>

        {/* Message */}
        <CustomInputEditor
          label="Message"
          required={true}
          placeholder="type text here"
          layout="vertical"
          formClass={styles.label_editor}
          inputClass={styles.input_editor}
          handleOnChange={(input) => handleOnChangeMessageInput(input.text)}
          value={`<table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border:1px solid #f1f2f5">
          <tbody><tr>
              <td colspan="3" height="60" bgcolor="#ffffff" style="border-bottom:1px solid #eeeeee;padding-left:16px" align="left">
                  
                      <img src="https://ci6.googleusercontent.com/proxy/6x7GEfwcNyxToo13trxasGaVMnoaHf3ru-gFjCMb_5bvCTPOiAYqo9c19D2PW8f5_F4hIj2kLWfXjbmUmYxl60at0jVF-V7O9R8nHujmUy7y=s0-d-e1-ft#https://cloud.mongodb.com/static/images/logo-mongodb-atlas.png" style="display:block;width:112px;height:41px" class="CToWUd">
                  
              </td>
          </tr>
          <tr><td colspan="3" height="20"></td></tr>
          <tr>
              <td width="20"></td>
              <td align="left">
                  
                  <table cellpadding="0" cellspacing="0" width="100%">
                      <tbody><tr>
                          <td colspan="3"><span style="font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:10px;color:#999999">ORGANIZATION</span></td>
                        </tr>
                        <tr>
                          <td colspan="3"><span style="font-family:Helvetica,Arial,sans-serif;font-weight:normal;font-size:20px;line-height:20px;color:#333333"><a href="https://cloud.mongodb.com/v2#/org/624277c9c937984f4e9c961e/projects" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://cloud.mongodb.com/v2%23/org/624277c9c937984f4e9c961e/projects&amp;source=gmail&amp;ust=1657709312230000&amp;usg=AOvVaw3wjRJdT9OCfH-9QQVclXY2">Thinh's Org - 2022-03-29</a></span></td>
                        </tr>
                        <tr><td colspan="3" height="20"></td></tr>
                        <tr>
                          <td colspan="3"><span style="font-family:Helvetica,Arial,sans-serif;font-weight:bold;font-size:10px;color:#999999">PROJECT</span></td>
                        </tr>
                        <tr>
                          <td colspan="3"><span style="font-family:Helvetica,Arial,sans-serif;font-weight:normal;font-size:20px;line-height:20px;color:#333333"><a href="https://cloud.mongodb.com/v2/624277ca766b215461dd63e5" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://cloud.mongodb.com/v2/624277ca766b215461dd63e5&amp;source=gmail&amp;ust=1657709312230000&amp;usg=AOvVaw0WDkMdLrJnunTm_auj7chm">Calendar</a></span></td>
                        </tr>
                        <tr><td colspan="3" height="20"></td></tr>
                        <tr><td colspan="3" height="1" bgcolor="#eeeeee" style="font-size:1px;line-height:1px">&nbsp;</td></tr>
                      <tr><td colspan="3" height="20"></td></tr>
                      <tr><td colspan="3"><div style="font-family:helvetica,arial,sans-serif;font-size:14px;line-height:20px">
<div style="padding-bottom:25px">
<p>Hi Thinh,</p>

<p>Your M0 free tier cluster, <a href="https://cloud.mongodb.com/v2/624277ca766b215461dd63e5#clusters/detail/Cluster0" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://cloud.mongodb.com/v2/624277ca766b215461dd63e5%23clusters/detail/Cluster0&amp;source=gmail&amp;ust=1657709312230000&amp;usg=AOvVaw0BJIaMbrBuFgXem-e5NtJ4">Cluster0</a>, has been idle
  
      since 2022/04/27.
  
</p>


  <p>MongoDB Atlas will automatically pause this cluster after 60 days of inactivity, at 5:19 PM ICT on 2022/06/26.</p>


<p>To prevent this cluster from being paused, initiate a connection to your cluster before 2022/06/26. View <a href="https://dochub.mongodb.org/core/connect-idle-cluster" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://dochub.mongodb.org/core/connect-idle-cluster&amp;source=gmail&amp;ust=1657709312230000&amp;usg=AOvVaw1lATqYXvubxNAfzPKnGGlo">our documentation</a> for instructions on how to connect to your cluster.</p>
</div>

<a href="https://cloud.mongodb.com/v2/624277ca766b215461dd63e5#clusters/detail/Cluster0" style="text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://cloud.mongodb.com/v2/624277ca766b215461dd63e5%23clusters/detail/Cluster0&amp;source=gmail&amp;ust=1657709312230000&amp;usg=AOvVaw0BJIaMbrBuFgXem-e5NtJ4">
<div style="width:200px;font-size:15px;line-height:40px;border-radius:5px;background-color:#13aa52;border:1px solid #507b32;text-align:center;margin:auto;color:#ffffff">
  View Cluster
</div>
</a>
</div>
</td></tr>
                      <tr><td colspan="3" height="20"></td></tr>
                      <tr>
                          <td colspan="3" style="text-align:center">
                              <span style="font-family:Helvetica,Arial,sans-serif;font-size:12px;color:#cccccc">This message was sent from MongoDB, Inc., 1633 Broadway, 38th floor, NY, NY 10019</span>
                          </td>
                      </tr>
                      </tbody></table>
              </td>
              <td width="20"></td>
          </tr>
          <tr><td colspan="3" height="20"></td></tr>
      </tbody></table>`}
        />
      </EntryFormWrapper>
    </div>
  );
};
