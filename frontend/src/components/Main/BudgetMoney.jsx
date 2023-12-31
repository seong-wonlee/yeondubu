import {React, useEffect, useState} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Container = styled.div`
position: sticky;
top: 0;
z-index: 1;
height: ${props => (props.isBudgetOpen ? '470px' : '230px')}; /* 상태에 따라 높이 변경 */
background: #FFD0D0;
flex-direction: column;
align-items: center;
justify-content: center;
transition: height 0.3s;
overflow: hidden;

`;

const Dday = styled.p`
color: #FFF;
text-align: center;
font-size: 20px;
font-style: normal;
font-weight: 800;
line-height: normal;
margin: 0px;
padding-top: 50px;
`

const EstimatedMoney = styled.p`
color: #FFF;
font-size: 25px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin: 20px;
`

const EstimatedMoneyDetail = styled.p`
color: #FFF;
text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
font-size: 36px;
font-style: normal;
font-weight: 700;
line-height: normal;
margin: 10px;
`

const WeHave = styled.p`
color: #FFF;
font-size: 23px;
font-style: normal;
font-weight: 400;
line-height: normal;
margin-top: 50px;
`

const WeHaveDetail = styled.p`
color: #F5F5F5;
text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
font-size: 30px;
font-style: normal;
font-weight: 500;
line-height: normal;
margin: 20px;
`

const WeNeed = styled.p`
color: #FFF;
font-size: 23px;
font-style: normal;
font-weight: 400;
line-height: normal;
`

const WeNeedDetail = styled.p`
color: #F5F5F5;
text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
font-size: 30px;
font-style: normal;
font-weight: 500;
line-height: normal;
margin: 20px;
`
const BudgetMoney = ({ isBudgetOpen }) => {
    const navigate = useNavigate();
    const [accessToken, setAccessToken] = useState('');
    const [estimatedMoney, setEstimatedMoney] = useState(0); // 예상 금액 상태 추가
    const [cashMoney, setCashMoney] = useState(0); // 예상 금액 상태 추가
    const [accountMoney, setAccountMoney] = useState(0);
    const [weddingDate, setWeddingDate] = useState("");
    useEffect(() => {
      const token = localStorage.getItem("token");
      setAccessToken(token);
    }, []);

    useEffect(() => {
      if(accessToken){
      axios.get(`${process.env.REACT_APP_API_ROOT}/api/v1/couples/info`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          console.log('여기는 디데이 계산',response)
          setWeddingDate(response.data);
        })
        .catch((error) => {
          console.error("여기는 디데이 계산", error);
          navigate('/weddingday')
        });
      }
    }, [accessToken,navigate]); 

    const calculateDDay = (weddingDate) => {
      const today = new Date();
      const weddingDay = new Date(weddingDate);
      const timeDiff = weddingDay.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return daysDiff;
    };
    const dDay = calculateDDay(weddingDate);
    const formatDDay = (days) => {
      if (days === 0) {
        return "D-Day";
      } else if (days > 0) {
        return `D-${days}`;
      } else {
        return `D+${Math.abs(days)}`;
      }
    };
    const dDayLabel = formatDDay(dDay);

    useEffect(() => {
      if (accessToken) {
        axios
          .get(`${process.env.REACT_APP_API_ROOT}/api/v1/money/total-expect`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log('예상금액 요청 성공:', response.data);
            const estimatedMoneyValue = response.data.total_expenditure; 
            setEstimatedMoney(estimatedMoneyValue); // 상태를 업데이트
          })
          .catch((error) => {
            console.error('요청 실패:', error);
          });
      }
    }, [accessToken]);

    useEffect(() => {
        if (accessToken) {
          axios
            .get(`${process.env.REACT_APP_API_ROOT}/api/v1/money/total-cash`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then((response) => {
              console.log('현금 요청 성공:', response.data);
              const estimatedMoneyValue = response.data; 
              setCashMoney(estimatedMoneyValue); // 상태를 업데이트
            })
            .catch((error) => {
              console.error('요청 실패:', error);
            });
        }
      }, [accessToken]);
    
      useEffect(() => {
        if (accessToken) {
          axios
            .get(`${process.env.REACT_APP_API_ROOT}/api/v1/money/total-account`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then((response) => {
              console.log('토탈 계좌 요청 성공:', response.data);
              const estimatedMoneyValue = response.data; 
              setAccountMoney(estimatedMoneyValue); // 상태를 업데이트
            })
            .catch((error) => {
              console.error('요청 실패:', error);
            });
        }
      }, [accessToken]);

    return (
        <Container isBudgetOpen={isBudgetOpen}>
            <Dday>{dDayLabel}</Dday>
            <EstimatedMoney>총 예상 금액</EstimatedMoney>
            <EstimatedMoneyDetail>
            {typeof estimatedMoney !== 'undefined' ? estimatedMoney.toLocaleString() + '원' : '0원'}
            </EstimatedMoneyDetail>

            <WeHave>함께 이만큼 모았어요</WeHave>
            <WeHaveDetail>
                {(cashMoney.bride_total_cash+cashMoney.groom_total_cash
                +accountMoney.bride_total_account +accountMoney.groom_total_account).toLocaleString() +'원'}</WeHaveDetail>
            <WeNeed>앞으로 이만큼 남았어요</WeNeed>
            <WeNeedDetail>
                {(estimatedMoney - (cashMoney.bride_total_cash+cashMoney.groom_total_cash
                +accountMoney.bride_total_account +accountMoney.groom_total_account)).toLocaleString() +'원'}
            </WeNeedDetail>
        </Container>
    );
};

export default BudgetMoney;