import React, { useState, useEffect } from 'react';
import AguaFalse from '../svg/Agua_false.png'
import AguaTrue from '../svg/Agua_true.png'
import Secofalse from '../svg/Seco_false.png'
import Secotrue from '../svg/Seco_true.png'

function Form() {

    const [ip, setIp] = useState('');
    const [longitude, setLongitude] = useState('');
    const [latitude, setLatitude] = useState('');
    const [regionCode, setRegionCode] = useState('');
    const [regionName, setRegionName] = useState('');
    const [water,setWater] = useState('');
    const [tempo,setTempo] = useState('');
    const [data,setData] = useState('');
    const [temperaturaC,setTemperaturaC] = useState('');

    useEffect(() => { 
        const fetchData = async () => {
            try {
                const meuTokenIp = '2a30c7a32425d6'
                const response = await fetch('https://ipinfo.io?token=' + meuTokenIp);  // Pega o ip da pessoa assim que entra

                const data = await response.json();

                if (!response.ok) {
                    throw new Error('Erro ao obter informações do IP');
                }

                setIp(data.ip); // setando o ip para usar no front

                const apiKey = 'e1186d7a-66e4-4385-9a38-c7ca2d2b5976';   // chave-key da minha conta
                const apiUrl = `https://apiip.net/api/check?ip=${data.ip}&accessKey=${apiKey}`;  // requisicao http  | API se está na agua

                const pegaIP = await fetch(apiUrl);
                const dados = await pegaIP.json();


                setLongitude(dados.longitude);
                setLatitude(dados.latitude);
                setRegionCode(dados.regionCode);
                setRegionName(dados.regionName);

                const url = `https://isitwater-com.p.rapidapi.com/?latitude=${latitude}&longitude=${longitude}`;
                const options = {
                    method: 'GET',
                    headers: {
                        'X-RapidAPI-Key': '65d5414800mshacea6ec58a7d379p1b8a8ejsncbcfa84ecd26',
                        'X-RapidAPI-Host': 'isitwater-com.p.rapidapi.com'
                    }
                };
        
                const acessandoApi = await fetch(url, options);
                const result = await acessandoApi.json();

                setWater(result.water ? '1' : '0');

                const pegaTempo = `https://api.hgbrasil.com/weather?format=json-cors&key=bb19c1ad&lat=${latitude}&lon=${longitude}&user_ip=remote`;  // Transformei o formato em json e a requisição funcionou

                try {
                  const acessando = await fetch(pegaTempo);
                  if (!acessando.ok) {
                    throw new Error('Erro na solicitação. Código de status:', acessando.status);
                  }
                  const arrayTempo = await acessando.json();
                    setTempo(arrayTempo.results.condition_slug);
                    setData(arrayTempo.results.date);
                    setTemperaturaC(arrayTempo.results.temp);
                } catch (error) {
                  console.error('Erro durante a execução:', error);
                }

            } catch (error) {
                console.error(error);
            }
            };

        fetchData()
    },[])

        
        return(
            <div className='main'>
                    <label><p>IP do computador</p></label>
                        <input name='ip' value={`IP ${ip}`}  placeholder='Digite o ip' readOnly />
                    <p>Dados do usuário</p>

                    {regionCode ? (
                        <div className='inputs'>
                            <input name='regiao' value={` Cidade   ${regionName}`} readOnly/><br></br>
                            <input name='regiao' value={` UF           ${regionCode}`} readOnly/>
                        </div>
                    ): <div>
                            <h5>Aguardando Resultados</h5>
                        </div>}

                        <br></br>
                    <div className='trueOrFalse'>
                        <h4>Está na agua?  
                        {water ? (
                            water === '1' ? (
                                <span>
                                <span className='water'><img src={AguaTrue} alt='AguaTrue'/> Sim</span>  
                                <span className='false'> <img src={Secofalse} alt='SecoFalse' /> Não </span>
                                </span>
                            ) : (
                                <span>
                                <span className='false'> <img src={AguaFalse} alt='AguaFalse' /> Sim </span>  
                                <span className='seco'> <img src={Secotrue} alt='Secotrue' /> Não </span>
                                </span>
                            )
                        ) : <div>
                            <span>
                                <span className='false'><img src={AguaFalse} alt='AguaFalse'/> Sim</span>  
                                <span className='false'> <img src={Secofalse} alt='SecoFalse' /> Não </span>
                            </span>
                            </div>}
                        </h4>
                        <br></br>

                        <h4>Está muito calor?</h4>
                        {tempo.length> 0 ? (
                            <div>
                                <div >
                                <img className='containerImagemClima'
                                style={{ width: '15em', height: '15em' }}
                                src={`https://assets.hgbrasil.com/weather/icons/conditions/${tempo}.svg`}
                                alt='Imagem de condição climática'
                                title={tempo === 'clear_day' ? ('Muito'): 'Pouco'}
                                />
                                <div style={{ textAlign: 'center'}}>
                                    <h5>Temperatura: {temperaturaC}º</h5>
                                    <h5> Data da Consulta: {data}</h5>
                                </div>
                            </div>

                            </div>
                        ): (
                            <div>
                                <h4>Aguardando Resultados</h4>
                            </div>
                        )}

                    </div>

            </div>
        )

    }

export default Form;