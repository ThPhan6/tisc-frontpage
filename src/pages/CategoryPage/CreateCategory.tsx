import CustomButton from '@/components/Button';
import { FormGroup } from '@/components/Form';
import { CustomInput } from '@/components/Form/CustomInput';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Collapse, Row } from 'antd';
import React, { useState } from 'react';
import { ReactComponent as CirclePlusIcon } from '../../assets/icons/circle-plus.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import { ReactComponent as DropdownIcon } from '../../assets/icons/drop-down-icon.svg';
import { ReactComponent as DropupIcon } from '../../assets/icons/drop-up-icon.svg';
import { ReactComponent as RemoveIcon } from '../../assets/icons/remove-gray-icon.svg';
import { ReactComponent as SquarePlusIcon } from '../../assets/icons/square-plus.svg';
import styles from './CreateCategory.less';
const { Panel } = Collapse;

const CreateCategory: React.FC = () => {
  type CategoryProp = {
    category_name: string;
    id?: number;
  };

  type SubCategoryProp = {
    subcategory_name: string;
    category: CategoryProp[];
    id?: number;
    is_open: boolean;
  };
  type MainCategoryProp = {
    maincategory_name: string;
    subcategory: SubCategoryProp[];
    id?: number;
  };

  const oCategory: CategoryProp = {
    category_name: '',
  };
  const oSubcategory: SubCategoryProp = {
    subcategory_name: '',
    category: [],
    is_open: false,
  };
  const oMaincategory: MainCategoryProp = {
    maincategory_name: '',
    subcategory: [],
  };
  const [maincategoryState, setMaincategoryState] = useState<MainCategoryProp>(oMaincategory);

  const [activeCollapseState, setActiveCollapseState] = useState<number[]>([]);

  const handleAddSubCategoryButton = () => {
    setMaincategoryState({
      ...maincategoryState,
      subcategory: [...maincategoryState.subcategory, oSubcategory],
    });
  };
  const handleAddCategoryButton = (index: number) => {
    maincategoryState.subcategory[index].category.push(oCategory);
    setMaincategoryState({ ...maincategoryState });
  };

  const handleRemoveSubCategoryButton = (index: number) => {
    maincategoryState.subcategory.splice(index, 1);
    setMaincategoryState({ ...maincategoryState });
  };
  const handleRemoveCategoryButton = (subcategoryindex: number, index: number) => {
    maincategoryState.subcategory[subcategoryindex].category.splice(index, 1);
    setMaincategoryState({ ...maincategoryState });
  };

  const setMainCategoryName = (value: string) => {
    setMaincategoryState({
      ...maincategoryState,
      maincategory_name: value,
    });
  };
  const setSubCategoryName = (index: number, value: string) => {
    maincategoryState.subcategory[index].subcategory_name = value;
    setMaincategoryState({ ...maincategoryState });
  };

  const setCategoryName = (subcategoryindex: number, index: number, value: string) => {
    maincategoryState.subcategory[subcategoryindex].category[index].category_name = value;
    setMaincategoryState({ ...maincategoryState });
  };
  const expandCollapse = (index: number, isOpen: boolean) => {
    maincategoryState.subcategory[index].is_open = isOpen;
    setMaincategoryState({ ...maincategoryState });
    const aActiveCollapse: number[] = [];
    maincategoryState.subcategory.map((items: SubCategoryProp, key: number) => {
      if (items.is_open) {
        aActiveCollapse.push(key + 1);
      }
    });
    setActiveCollapseState(aActiveCollapse);
  };

  return (
    <PageContainer>
      <div className={styles.create_category_form}>
        <Row>
          <Col span={12}>
            <Card className={styles.form_card} bodyStyle={{ padding: 0, width: '100%' }}>
              <div className={styles.form_header}>
                <div className={styles.title}>ENTRY FORM</div>
                <a className={styles.close}>
                  <CloseIcon width="18px" height="18px" />
                </a>
              </div>
              <div className={styles.form_body}>
                <div className={styles.form_input}>
                  <div className={styles.maincategory_element}>
                    <div className={styles.maincategory_header}>
                      <div className={styles.maincategory_title}>Main Category</div>
                      <a
                        className={styles.maincategory_addmore}
                        onClick={handleAddSubCategoryButton}
                      >
                        <SquarePlusIcon width="18px" height="18px" />
                      </a>
                    </div>
                    <div className={styles.maincategory_forminput_element}>
                      <CustomInput
                        placeholder="type main category name"
                        focusColor="primary"
                        value={maincategoryState.maincategory_name}
                        onChange={(e) => setMainCategoryName(e.target.value)}
                      />
                    </div>
                  </div>

                  {maincategoryState.subcategory.length > 0
                    ? maincategoryState.subcategory.map(
                        (subcategoryitem: SubCategoryProp, index: number) => (
                          <Collapse activeKey={activeCollapseState} ghost={true} key={index}>
                            <Panel
                              showArrow={false}
                              header={
                                <div>
                                  <div className={styles.subcategory_header}>
                                    <div
                                      className={styles.subcategory_title}
                                      onClick={() =>
                                        expandCollapse(index, !subcategoryitem.is_open)
                                      }
                                    >
                                      <span>Subcategory</span>
                                      <span className={styles.subcategory_arrow}>
                                        {subcategoryitem.is_open == true ? (
                                          <DropupIcon width="18px" height="18px" />
                                        ) : (
                                          <DropdownIcon width="18px" height="18px" />
                                        )}
                                      </span>
                                    </div>
                                    <a
                                      className={styles.subcategory_addmore}
                                      onClick={() => {
                                        handleAddCategoryButton(index);
                                        expandCollapse(index, true);
                                      }}
                                    >
                                      <CirclePlusIcon width="18px" height="18px" />
                                    </a>
                                  </div>
                                  <div className={styles.subcategory_forminput}>
                                    <div className={styles.subcategory_forminput_element}>
                                      <CustomInput
                                        placeholder="type subcategory name"
                                        focusColor="primary"
                                        value={subcategoryitem.subcategory_name}
                                        onChange={(e) => setSubCategoryName(index, e.target.value)}
                                      />
                                    </div>
                                    <a
                                      className={styles.subcategory_remove}
                                      onClick={() => handleRemoveSubCategoryButton(index)}
                                    >
                                      <RemoveIcon width="18px" height="18px" />
                                    </a>
                                  </div>
                                </div>
                              }
                              key={index + 1}
                            >
                              {subcategoryitem.category.length > 0
                                ? subcategoryitem.category.map(
                                    (categoryitem: CategoryProp, categoryindex: number) => (
                                      <div className={styles.category_element} key={categoryindex}>
                                        <div className={styles.category_forminput}>
                                          <div className={styles.category_forminput_element}>
                                            <FormGroup
                                              label="Category"
                                              formClass={styles.category_formgroup}
                                            >
                                              <CustomInput
                                                placeholder="type category name"
                                                focusColor="primary"
                                                value={categoryitem.category_name}
                                                onChange={(e) =>
                                                  setCategoryName(
                                                    index,
                                                    categoryindex,
                                                    e.target.value,
                                                  )
                                                }
                                              />
                                            </FormGroup>
                                          </div>
                                          <a
                                            className={styles.category_remove}
                                            onClick={() =>
                                              handleRemoveCategoryButton(index, categoryindex)
                                            }
                                          >
                                            <RemoveIcon />
                                          </a>
                                        </div>
                                      </div>
                                    ),
                                  )
                                : null}
                            </Panel>
                          </Collapse>
                        ),
                      )
                    : null}
                </div>
              </div>
              <div className={styles.form_footer}>
                <CustomButton buttonClass={styles.button_cancel}>Cancel</CustomButton>
                <CustomButton buttonClass={styles.button_save}>Save</CustomButton>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default CreateCategory;
