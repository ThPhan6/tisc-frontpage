import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import { BodyText } from '@/components/Typography';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { Col, Collapse, Row } from 'antd';
import styles from '../styles/HowToEntryForm.less';
import React, { FC } from 'react';
import { IFAQFieldProps, IHowToSubProps, IHowToValueProps } from '../types';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import CustomButton from '@/components/Button';
import { isEmpty } from 'lodash';

interface IHowToEntryForm {
  value: IHowToValueProps;
  onChange: (value: IHowToValueProps) => void;
}

interface IPanelHeader {
  value: IHowToValueProps;
  panel: IHowToSubProps;
  handleActiveKeyToCollapse: (title: string) => void;
  index: number;
}

interface IFAQField {
  value: IFAQFieldProps;
  onChange: (value: IFAQFieldProps) => void;
  handleDeleteFAQItem: () => void;
  handleDeleteAnswerFieldItem: () => void;
}

const DEFAULT_FAQ_FIELD = {
  question: '',
  answer: '',
};

const QuestionAndAnswerField: FC<IFAQField> = ({
  value,
  onChange,
  handleDeleteFAQItem,
  handleDeleteAnswerFieldItem,
}) => {
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.FAQ_field}>
      <div className={styles.FAQ_field__input}>
        <div className={styles.FAQ_field__input_question}>
          <CustomTextArea
            placeholder="type question here"
            name="question"
            value={value.question}
            onChange={handleOnChangeInput}
          />
          <ActionDeleteIcon className={styles.question_delete_icon} onClick={handleDeleteFAQItem} />
        </div>
        <div className={styles.FAQ_field__input_answer}>
          <CustomTextArea
            placeholder="type answer here"
            name="answer"
            value={value.answer}
            onChange={handleOnChangeInput}
          />
          {!isEmpty(value.answer) && (
            <ActionRemoveIcon
              className={styles.answer_remove_icon}
              onClick={handleDeleteAnswerFieldItem}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const RenderPanelHeader: FC<IPanelHeader> = ({
  value,
  panel,
  handleActiveKeyToCollapse,
  index,
}) => {
  return (
    <div key={index} className={styles.panel}>
      <div className={styles.panel_header} onClick={() => handleActiveKeyToCollapse(panel.title)}>
        <div className={styles.panel_header__info}>
          {panel.icon && panel.icon}
          <BodyText
            level={4}
            fontFamily="Roboto"
            customClass={
              value.activeKey !== panel.title ? styles.font_weight_300 : styles.font_weight_500
            }
          >
            {panel.title}
          </BodyText>
        </div>
        <ArrowIcon
          className={styles.panel_header__collapse_icon}
          style={{
            transform: `rotate(${value.activeKey !== panel.title ? '0' : '180'}deg)`,
          }}
        />
      </div>
    </div>
  );
};

export const HowToEntryForm: FC<IHowToEntryForm> = ({ value, onChange }) => {
  const handleActiveKeyToCollapse = (collapseValue: string) => {
    onChange({
      activeKey: value.activeKey === collapseValue ? '' : collapseValue,
      data: value.data,
    });
  };

  const updatedOnChange = (dataHowTo: IHowToValueProps) => {
    onChange({ ...dataHowTo, data: dataHowTo.data });
  };

  const handleOnChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newItem = [...value.data];
    newItem[index].description = e.target.value;
    updatedOnChange(value);
  };

  const handleOnChangeFAQContent = (faq: IFAQFieldProps, panelIndex: number, faqIndex: number) => {
    const newItem = [...value.data];
    newItem[panelIndex].FAQ[faqIndex] = faq;
    updatedOnChange(value);
  };

  const handleAddFAQContent = (index: number) => {
    const newItem = [...value.data];
    newItem[index].FAQ = [...newItem[index].FAQ, DEFAULT_FAQ_FIELD];
    updatedOnChange(value);
  };

  const handleDeleteFAQItem = (panelIndex: number, faqIndex: number) => {
    const newItem = [...value.data];
    newItem[panelIndex].FAQ.splice(faqIndex, 1);
    updatedOnChange(value);
  };

  const handleDeleteAnswerFieldItem = (panelIndex: number, faqIndex: number) => {
    const newItem = [...value.data];
    newItem[panelIndex].FAQ[faqIndex].answer = '';
    updatedOnChange(value);
  };

  return (
    <Row>
      <Col span={12}>
        <div className={styles.main_container}>
          <div className={styles.content_container}>
            <div className={styles.collapse_container}>
              {value.data.map((panel, panelIndex) => {
                return (
                  <Collapse key={panelIndex} ghost activeKey={value.activeKey}>
                    <Collapse.Panel
                      className={
                        value.activeKey !== panel.title
                          ? styles.active_collapse_panel
                          : styles.unactive_collapse_panel
                      }
                      header={
                        <RenderPanelHeader
                          value={value}
                          panel={panel}
                          handleActiveKeyToCollapse={handleActiveKeyToCollapse}
                          index={panelIndex}
                        />
                      }
                      key={panel.title}
                      showArrow={false}
                    >
                      <FormGroup label="Description" required={true} layout="vertical">
                        <CustomTextArea
                          placeholder="type text here"
                          name="description"
                          value={panel.description}
                          onChange={(e) => handleOnChangeDescription(e, panelIndex)}
                        />
                      </FormGroup>
                      <div className={styles.add_content}>
                        <BodyText level={3} customClass={styles.text}>
                          Add Content
                        </BodyText>
                        <CustomPlusButton onClick={() => handleAddFAQContent(panelIndex)} />
                      </div>
                      {panel.FAQ.map((faqItem, faqIndex) => {
                        return (
                          <QuestionAndAnswerField
                            key={`panel_${panelIndex}_faq_${faqIndex}`}
                            value={faqItem}
                            onChange={(faq) => handleOnChangeFAQContent(faq, panelIndex, faqIndex)}
                            handleDeleteFAQItem={() => handleDeleteFAQItem(panelIndex, faqIndex)}
                            handleDeleteAnswerFieldItem={() =>
                              handleDeleteAnswerFieldItem(panelIndex, faqIndex)
                            }
                          />
                        );
                      })}
                    </Collapse.Panel>
                  </Collapse>
                );
              })}
            </div>
            <div className={styles.footer}>
              <CustomButton size="small" buttonClass={styles.submitBtn}>
                Save
              </CustomButton>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};
