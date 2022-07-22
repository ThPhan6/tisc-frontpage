import { ReactComponent as ActionDeleteIcon } from '@/assets/icons/action-delete-icon.svg';
import { ReactComponent as ActionRemoveIcon } from '@/assets/icons/action-remove-icon.svg';
import { ReactComponent as ArrowIcon } from '@/assets/icons/drop-down-icon.svg';
import CustomButton from '@/components/Button';
import { FormGroup } from '@/components/Form';
import { CustomTextArea } from '@/components/Form/CustomTextArea';
import CustomPlusButton from '@/components/Table/components/CustomPlusButton';
import { BodyText } from '@/components/Typography';
import { showImageUrl } from '@/helper/utils';
import { FaqItem, FaqState } from '@/types/faq.type';
import { Col, Collapse, Row } from 'antd';
import { isEmpty } from 'lodash';
import React, { FC } from 'react';
import styles from '../styles/HowToEntryForm.less';
import { FaqInput, FaqPanel } from '../types';

interface FAQFieldProps {
  index: number;
  value: FaqInput;
  onChange: (index: number, value: FaqInput) => void;
  handleDeleteQnAItem: (index: number) => void;
  handleDeleteAnswerFieldItem: (index: number) => void;
}

const DEFAULT_FAQ_FIELD = {
  question: '',
  answer: '',
};

const QuestionAndAnswerField: FC<FAQFieldProps> = ({
  index,
  value,
  onChange,
  handleDeleteQnAItem,
  handleDeleteAnswerFieldItem,
}) => {
  /// handle change FAQ field
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(index, {
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
            maxHeight={80}
            defaultHeight={24}
            maxLength={300}
          />
          <ActionDeleteIcon
            className={styles.question_delete_icon}
            onClick={() => handleDeleteQnAItem(index)}
          />
        </div>
        <div className={styles.FAQ_field__input_answer}>
          <CustomTextArea
            placeholder="type answer here"
            name="answer"
            value={value.answer}
            onChange={handleOnChangeInput}
            maxHeight={80}
            defaultHeight={32}
            maxLength={500}
          />
          {!isEmpty(value.answer) && (
            <ActionRemoveIcon
              className={styles.answer_remove_icon}
              onClick={() => handleDeleteAnswerFieldItem(index)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface PanelHeaderProps {
  isExpanded: boolean;
  index: number;
  panel: FaqPanel;
  handleActiveKeyToCollapse: (index: number) => void;
}

const PanelHeader: FC<PanelHeaderProps> = ({
  index,
  panel,
  isExpanded,
  handleActiveKeyToCollapse,
}) => {
  return (
    <div className={styles.panel}>
      <div
        className={styles.panel_header}
        onClick={() => handleActiveKeyToCollapse(isExpanded ? 0 : index + 1)}
      >
        <div className={styles.panel_header__info}>
          {panel?.logo && <img src={showImageUrl(String(panel.logo))} className={styles.icon} />}
          <BodyText
            level={4}
            fontFamily="Roboto"
            customClass={isExpanded ? styles.font_weight_500 : styles.font_weight_300}
          >
            {panel.title}
          </BodyText>
        </div>
        <ArrowIcon
          className={styles.panel_header__collapse_icon}
          style={{
            transform: `rotate(${isExpanded ? '180' : '0'}deg)`,
          }}
        />
      </div>
    </div>
  );
};

interface HowToEntryFormProps {
  value: FaqState;
  onChange: (value: FaqState) => void;
  onSubmit: () => void;
  submitButtonStatus: boolean;
}

export const HowToEntryForm: FC<HowToEntryFormProps> = ({ value, onChange, onSubmit }) => {
  const handleActiveKeyToCollapse = (index: number) => {
    onChange({
      expandedIndex: index,
      value: value.value,
    });
  };
  /// overwrite data
  const updatedOnChange = (v: FaqItem[]) => {
    onChange({ ...value, value: v });
  };

  /// handle change description
  const handleOnChangeDescription = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    panelIndex: number,
  ) => {
    const newValue = [...value.value];
    if (!newValue[panelIndex].document.document) {
      newValue[panelIndex].document.document = '';
    }
    newValue[panelIndex].document.document = e.target.value;
    updatedOnChange(newValue);
  };

  const handleChangeQnA = (panelIndex: number) => (qnaIdx: number, faqValue: FaqInput) => {
    const newValue = value.value;
    const newQnAs = newValue[panelIndex].document.question_and_answer;
    newQnAs[qnaIdx] = faqValue;
    newValue[panelIndex].document.question_and_answer = newQnAs;
    updatedOnChange(newValue);
  };

  const handleAddFAQContent = (panelIndex: number) => {
    const newValue = value.value;
    /// add new question_and_answer in document if it undefined
    if (!newValue[panelIndex].document.question_and_answer) {
      newValue[panelIndex].document.question_and_answer = [DEFAULT_FAQ_FIELD];
    } else {
      /// keep existed FAQ content and add new FAQ item
      newValue[panelIndex].document.question_and_answer.push(DEFAULT_FAQ_FIELD);
    }
    updatedOnChange(newValue);
  };

  const handleDeleteQnAItem = (panelIndex: number) => (faqIndex: number) => {
    const newValue = [...value.value];
    newValue[panelIndex].document.question_and_answer.splice(faqIndex, 1);
    updatedOnChange(newValue);
  };

  const handleDeleteAnswerFieldItem = (panelIndex: number) => (faqIndex: number) => {
    const newValue = [...value.value];
    newValue[panelIndex].document.question_and_answer[faqIndex].answer = '';
    updatedOnChange(newValue);
  };
  return (
    <Row>
      <Col span={12}>
        <div className={styles.main_container}>
          <div className={styles.collapse_container}>
            {value.value?.map((panel, panelIndex) => {
              const panelIdx = panelIndex + 1;
              const isExpanded = value.expandedIndex === panelIdx;

              return (
                <Collapse key={panel.id} ghost activeKey={value.expandedIndex}>
                  <Collapse.Panel
                    className={
                      isExpanded ? styles.active_collapse_panel : styles.unactive_collapse_panel
                    }
                    header={
                      <PanelHeader
                        key={panel.id}
                        panel={panel}
                        index={panelIndex}
                        isExpanded={isExpanded}
                        handleActiveKeyToCollapse={handleActiveKeyToCollapse}
                      />
                    }
                    key={panelIdx}
                    showArrow={false}
                  >
                    <FormGroup label="Description" required={true} layout="vertical">
                      <CustomTextArea
                        placeholder="type text here"
                        name="description"
                        value={panel.document.document}
                        onChange={(e) => handleOnChangeDescription(e, panelIndex)}
                        className={styles.description}
                        maxHeight={80}
                        defaultHeight={32}
                        maxLength={500}
                      />
                    </FormGroup>
                    <div
                      className={styles.add_content}
                      onClick={() => handleAddFAQContent(panelIndex)}
                    >
                      <BodyText level={3} customClass={styles.text}>
                        Add Content
                      </BodyText>
                      <CustomPlusButton size={20} />
                    </div>
                    <div className={styles.fAQ}>
                      {panel.document.question_and_answer?.map((faqItem, faqIndex) => {
                        return (
                          <QuestionAndAnswerField
                            key={`panel_${panelIndex}_faq_${faqIndex}`}
                            index={faqIndex}
                            value={faqItem}
                            onChange={handleChangeQnA(panelIndex)}
                            handleDeleteQnAItem={handleDeleteQnAItem(panelIndex)}
                            handleDeleteAnswerFieldItem={handleDeleteAnswerFieldItem(panelIndex)}
                          />
                        );
                      })}
                    </div>
                  </Collapse.Panel>
                </Collapse>
              );
            })}
          </div>
          <div className={styles.footer}>
            <CustomButton onClick={onSubmit} size="small" buttonClass={styles.submitBtn}>
              Save
            </CustomButton>
          </div>
        </div>
      </Col>
    </Row>
  );
};
