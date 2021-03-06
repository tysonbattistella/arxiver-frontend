import * as React from 'react';
import {Heading, Flex, Box, Text} from 'rebass';
import Input from "../components/Input";
import logo from '../static/svg/icon.svg';
import styled from "styled-components";
import {observer, inject} from "mobx-react";
import Navbar from "../components/Navbar";
import {Link} from "react-router-dom";
import Select from "../components/Select";
import FilterSelect from "../components/FilterSelect";

const Logo = styled('img')`
  max-height: 100%;
  max-width: 100%;
  height: 1em;
`;

const BrandedHeading = Heading.extend`
  font-family: "Aleo", system-ui, sans-serif
`;

const BrandedText = Text.extend`
  font-family: "Aleo", system-ui, sans-serif
`;

const RightText = Text.extend`
  text-align: right;
`;

@inject('PublicationStore')
@inject('SubjectStore')
@observer
export default class Brand extends React.Component {
  componentDidMount(){
    this.props.SubjectStore.fetchSubjects();
  }

  handleHomeClick(){
    const {PublicationStore} = this.props;
    PublicationStore.reset();
  }

  handleInputChange(e){
    const {PublicationStore} = this.props;
    PublicationStore.setCurrentQuery(e.target.value);
  }

  handleKeyPress(e){
    const {PublicationStore, history} = this.props;
    if(e.key === 'Enter'){
      PublicationStore.fetchPublications(history);
    }
  }

  handleSubjectChange(e){
    const {PublicationStore, history} = this.props;
    PublicationStore.setCurrentQuery(e.target.value);
    PublicationStore.fetchPublications(history);
  }

  render(){
    const {PublicationStore, SubjectStore, match} = this.props;

    // If the client has searched already, display brand as a navbar
    if (!match.isExact){
      return (
        <Navbar>
          <Flex w={1} mb={1} flexWrap={'wrap'}>
            <Box mt={['6px']} mx={1}>
              <Link to={'/'} onClick={this.handleHomeClick.bind(this)}>
                <Heading fontSize={[5,4,5]} pr={3}><Logo src={logo}/></Heading>
              </Link>
            </Box>
            <Box ml={'auto'} mt={2}>
              <RightText fontSize={[1,2,3]} color={'text'}>
                Publications
              </RightText>
            </Box>
            <Box mx={1}>
              <Text fontSize={[1,2,3]} color={'text'}>
                <FilterSelect/>
              </Text>
            </Box>
            <Box>
              {PublicationStore.currentFilterType === PublicationStore.FILTER_TYPE_SUBJECT && (
                <Text fontSize={[1,2,3]}>
                  <Select dir='rtl' color={'text'} fontSize={[2,3,4]} onChange={this.handleSubjectChange.bind(this)} value={PublicationStore.currentQuery}>
                    <option value="">--Select a subject--</option>
                    {SubjectStore.subjects.map(s => (
                      <option key={s.key} value={s.key}>{s.name}</option>
                    ))}
                  </Select>
                </Text>
              )}
              {PublicationStore.currentFilterType !== PublicationStore.FILTER_TYPE_SUBJECT && (
                <Input fontSize={[1,2,3]}
                       underline={"true"}
                       color='text'
                       placeholder={'Search...'}
                       value={PublicationStore.currentQuery}
                       icon={'search'}
                       onChange={this.handleInputChange.bind(this)}
                       onKeyPress={this.handleKeyPress.bind(this)}/>
              )}
            </Box>
          </Flex>
        </Navbar>
      )
    }

    return (
      <Flex flexDirection={'column'}>
        <Box mx={'auto'} pt={[1, 2, 3, 4]}>
          <Heading fontSize={[7,8,9]}><Logo src={logo}/></Heading>
        </Box>
        <Box mx={'auto'} my={'auto'}>
          <BrandedHeading color='text' fontFamily={'system-ui'} fontSize={[7,8,9]}>Arxiver</BrandedHeading>
        </Box>
        <Box mx={'auto'}>
          <BrandedText color={'text'} fontSize={[1, 2, 3]}>
            A simple way to find ArXiv articles.
          </BrandedText>
        </Box>
        <Box mx={'auto'} mt={4} w={1}>
          <Input fontSize={[2,3,4]} pt={3} position={'center'} placeholder={'Search Articles, Authors, or Subjects...'} onChange={this.handleInputChange.bind(this)} onKeyPress={this.handleKeyPress.bind(this)} animate={'true'}/>
        </Box>
      </Flex>
    )
  }
}
