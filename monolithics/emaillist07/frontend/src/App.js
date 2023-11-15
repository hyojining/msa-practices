import React, {useState, useEffect} from 'react';
import './assets/scss/App.scss';
import RegisterForm from './RegisterForm';
import SearchBar from './SearchBar';
import Emaillist from './Emaillist';
// import data from './assets/json/data';

function App() {
    const [emails, setEmails] = useState(null);

    const addEmail = async (email) => { // 비동기 함수
        try{
            // 서버의 /api 엔드포인트에 POST 요청을 보내고, 비동기적으로 응답을 기다림
            const insertResponse = await fetch('/api', { 
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(email) // JavaScript에서 객체를 JSON 문자열로 변환
            });

            if(!insertResponse.ok) {
                throw new Error(`${insertResponse.status} ${insertResponse.statusText}`)
            }

            const json = await insertResponse.json(); // response에서 JSON 데이터 추출
            
            if(json.result !== 'success') {
                throw new Error(`${json.result} ${json.message}`)
            }

            setEmails([json.data, ...emails]); // 기존 emails 배열에 새 이메일 데이터 추가
            
        } catch(err) {
            console.error(err);
        }
    }

    const fetchEmails = async(keyword) => {
        try{
            const response = await fetch(`/api?kw=${keyword ? keyword : ''}`, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: null
            });

            if(!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`)
            }

            const json = await response.json();
            
            if(json.result !== 'success') {
                throw new Error(`${json.result} ${json.message}`)
            }

            console.log(json.data);
            setEmails(json.data);
            
        } catch(err) {
            console.error(err);
        }
    }

    useEffect(() => {
        fetchEmails();
    }, []);

    return (
        <div id={'App'}>
            <RegisterForm addEmail={addEmail}/>
            <SearchBar fetchEmails={fetchEmails}/>
            {
                emails === null ?
                null :
                <Emaillist emails={emails}/>
            }
        </div>
    );
}

export {App};