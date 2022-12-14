const wppconnect = require('@wppconnect-team/wppconnect');
const firebasedb = require('./firebase.js');



var userStages = [];

wppconnect.create({
    session: 'whatsbot',
    autoClose: false,
    puppeteerOptions: { args: ['--no-sandbox'] }
})
    .then((client) =>
        client.onMessage((message) => {
            console.log('Mensagem digitada pelo usuário: ' + message.body);
            stages(client, message);
        }))
    .catch((error) =>
        console.log(error));



async function queryUserByPhone(client, message) {
    let phone = (message.from).replace(/[^\d]+/g, '');
    let userdata = await firebasedb.queryByPhone(phone);
    if (userdata == null) {
        userdata = await saveUser(message);
    }
    console.log('Usuário corrente: ' + userdata['id']);
    stages(client, message, userdata);
}


//  Stages 
function stages(client, message) {
    stage = userStages[message.from];
    switch (stage) {
        case 'ABCD':
            {
                    sendWppMessage(client, message.from, 'Certo! Você foi citado em alguma *execução fiscal*? \n \n 1️⃣ - Sim \n 2️⃣ - Não')
                    if (message.body == '1') {
                        userStages[message.from] = 'sim';
                    } else if (message.body == '2') {
                        userStages[message.from] = 'nao';
                    }
            }
        break;       
        case 'OBG1':
            sendWppMessage(client, message.from, 'Obrigada pelas informações. Em instantes, iremos atender a sua solicitação.');
            userStages[message.from] = 'A001';
            break;
        case 'OBG2':
            sendWppMessage(client, message.from, 'Agradecemos pela sua colaboração!');
            userStages[message.from] = 'A001';
            break;
        case 'OD01':
            sendWppMessage(client, message.from, 'Informe o CPF do devedor e o RENAVAM do veiculo.');
            userStages[message.from] = 'OBG1';
            break;
        case 'OD02':
            sendWppMessage(client, message.from, 'Informe o CPF do devedor.');
            userStages[message.from] = 'OBG1';
            break;
        case 'OD03':
            sendWppMessage(client, message.from, 'Informe o número do processo judicial.');
            userStages[message.from] = 'OBG1';
            break;
        case 'OD04':
            sendWppMessage(client, message.from, 'Informe o CNPJ, a inscrição estadual e o número do auto de infração que deseja pagar.');
            userStages[message.from] = 'OBG1';
            break;
        case 'OD05':
            sendWppMessage(client, message.from, 'Informe o CNPJ, a inscrição estadual e o número do auto de infração que deseja parcelar.');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD06':
            sendWppMessage(client, message.from, 'Informe o número do processo judicial e envie o comprovante de pagamento.');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD07':
            sendWppMessage(client, message.from, 'Informe o número do processo judicial, envie o comprovante de pagamento da primeira parcela e o acordo de parcelamento.');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD08':
            sendWppMessage(client, message.from, 'Informe o número do processo judicial e envie o comprovante de pagamento juntamente com o documento de arrecadação utilizado para pagamento.');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD09':
            sendWppMessage(client, message.from, 'Informe o número do processo judicial e envie o comprovante de pagamento da primeira parcela juntamente com o acordo de parcelamento');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD10':
            sendWppMessage(client, message.from, 'Informe o CPF do devedor e o RENAVAM do veiculo que deseja parcelar o débito');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD11':
            sendWppMessage(client, message.from, 'Informe o CNPJ, a inscrição estadual e o auto de infração que deseja parcelar');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD12':
            sendWppMessage(client, message.from, 'Logo, entraremos em contato com você');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD32':
            sendWppMessage(client, message.from, 'Informe o CNPJ ou CPF, por favor.');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD31':
            sendWppMessage(client, message.from, 'Informe o CPF do devedor e o RENAVAM do veiculo que deseja parcelar o débito');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD33':
            sendWppMessage(client, message.from, 'Informe o CNPJ, a inscrição estadual e o auto de infração que deseja parcelar');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD34':
            sendWppMessage(client, message.from, 'Logo, entraremos em contato com você');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD35':
            sendWppMessage(client, message.from, 'Informe o número do processo que deseja tratar');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD36':
            sendWppMessage(client, message.from, 'Sobre qual assunto deseja falar?');
            userStages[message.from] = 'OBG1';
            break;

        case 'OD37':
            sendWppMessage(client, message.from, 'Pode falar!');
            userStages[message.from] = 'OBG1';
            break;
        case 'CD01':
            {
                sendWppMessage(client, message.from, 'Qual tipo de débito? \n \n 1️⃣ - IPVA \n 2️⃣ - ITCMD  \n 3️⃣ - Débito não tributário (Ex. TCE, Multa ambiental) ');
                if (message.body === '1') {
                    userStages[message.from] = 'OD01';
                } else if (message.body === '2') {
                    userStages[message.from] = 'CD02';
                } else if (message.body === '3') {
                    userStages[message.from] = 'CD03';
                }
            }
            break;


        case 'BD01':
            {
                sendWppMessage(client, message.from, 'Qual tipo de débito? \n \n 1️⃣ - IPVA \n 2️⃣ - ICMS  \n 3️⃣ - Débito não tributário (Ex. TCE, Multa ambiental) ');
                if (message.body === '1') {
                    userStages[message.from] = 'OD01';
                } else if (message.body === '2') {
                    userStages[message.from] = 'OD04';
                } else if (message.body === '3') {
                    userStages[message.from] = 'OD03';
                }
            }
            break;

        case 'BD02':
            {
                sendWppMessage(client, message.from, 'Qual tipo de débito? \n \n 1️⃣ - IPVA \n 2️⃣ - ICMS  \n 3️⃣ - Débito não tributário (Ex. TCE, Multa ambiental) ');
                if (message.body === '1') {
                    userStages[message.from] = 'OD01';
                } else if (message.body === '2') {
                    userStages[message.from] = 'OD05';
                } else if (message.body === '3') {
                    userStages[message.from] = 'OD03';
                }
            }
            break;

        case 'BD03':
            {
                sendWppMessage(client, message.from, 'Qual tipo de débito? \n \n 1️⃣ - IPVA \n 2️⃣ - ICMS  \n 3️⃣ - ITCMD \n 4️⃣ - Débito não tributário');
                if (message.body === '1') {
                    userStages[message.from] = 'OD31';
                } else if (message.body === '2') {
                    userStages[message.from] = 'OD33';
                } else if (message.body === '3') {
                    userStages[message.from] = 'OD34';
                } else if (message.body === '4') {
                    userStages[message.from] = 'OD34';
                }
            }
            break;
        case 'nao':
                {
                sendWppMessage(client, message.from, 'O que você deseja, então? \n \n 1️⃣ - Emissão de CND \n 2️⃣ - Simular parcelamento de débito inscrito em dívida ativa \n 3️⃣ - Agendar reunião com o Procurador(a) \n 4️⃣ - Telefones para contato / e-mail \n 5️⃣ - Falar com um servidor \n6️⃣ - Críticas ou elogios. ');
                const userStages = { 
                    '1': 'OD32',
                    '2': 'BD03',
                    '3': 'OBG1',
                    '4': 'OD36',
                    '5': 'OD37',
                    '6': 'OD36',
                }
                console.log(userStages[message.from]);
            }

            case 'sim':
                {
                sendWppMessage(client, message.from, 'A execução fiscal doi ajuizada em face de: \n \n 1️⃣ - Pessoa Física \n 2️⃣ - Pessoa Jurídica');
                {
                } if (message.body === '1') {    
                userStages[message.from] = 'S011';
                } else if (message.body === '2') {
                userStages[message.from] = 'S012';
                }
                }
            break;
        case 'S011':
            {
                sendWppMessage(client, message.from, 'Okay! Pessoa física. Obrigada! Como posso ajudar você? \n \n 1️⃣ - Emissão do documento de arrecadação para pagamento do débito e honorários; \n 2️⃣ - Simular parcelamento do débito; \n 3️⃣ - Emissão do documento de arrecadação somente dos honorários; \n 4️⃣ - O débito e os honorários foram pagos. Gostaria de enviar o comprovante e requerer a extinção da execução fiscal; \n 5️⃣ - Gostaria de informar o parcelamento do débito e requerer a suspensão da execução fiscal. ');
                if (message.body === '1') {
                    userStages[message.from] = 'CD01';
                } else if (message.body === '2'); {
                    userStages[message.from] = 'CD01';
                } if (message.body === '3'); {
                    userStages[message.from] = 'OD03';
                } if (message.body === '4'); {
                    userStages[message.from] = 'OD06';
                } if (message.body === '5'); {
                    userStages[message.from] = 'OD07';
                }
            }
            break;

        case 'S012':
            {
                sendWppMessage(client, message.from, 'Okay! Pessoa Jurídica. Obrigada! Como posso ajudar você? \n \n 1️⃣ - Emissão do documento de arrecadação para pagamento do débito e honorários; \n 2️⃣ - Simular parcelamento do débito; \n 3️⃣ - Emissão do documento de arrecadação somente dos honorários; \n 4️⃣ - O débito e os honorários foram pagos. Gostaria de enviar o comprovante e requerer a extinção da execução fiscal; \n 5️⃣ - Gostaria de informar o parcelamento do débito e requerer a suspensão da execução fiscal. ');
                if (message.body === '1') {
                    userStages[message.from] = 'BD01';
                } else if (message.body === '2') {
                    userStages[message.from] = 'BD02';
                } else if (message.body === '3') {
                    userStages[message.from] = 'OD03';
                } else if (message.body === '4') {
                    userStages[message.from] = 'OD08';
                } else if (message.body === '5') {
                    userStages[message.from] = 'OD09';
                }
            }
            break;
        case 'CD01':
            {
                sendWppMessage(client, message.from, 'Qual tipo de débito? \n \n 1️⃣ - IPVA \n 2️⃣ - ITCMD  \n 3️⃣ - Débito não tributário (Ex. TCE, Multa ambiental) ');
                if (message.body === '1') {
                    userStages[message.from] = 'OD01';
                } else if (message.body === '2') {
                    userStages[message.from] = 'OD02';
                } else if (message.body === '3') {
                    userStages[message.from] = 'OD03';
                }
            }
            break;
        default: // Olá 
            console.log('*Usuário atual* from:' + message.from);
            saveUser(message);
            sendWppMessage(client, message.from, 'Bem-vindo! Sou a Luísa, assistente virtual da Procuradoria da Dívida Ativa! Vou ajudar você a resolver o que for preciso! \n \n Qual seu nome? ');
            userStages[message.from] = 'ABCD';
    }
}


function sendWppMessage(client, sendTo, text) {
    client
        .sendText(sendTo, text)
        .then((result) => {
            // console.log('SUCESSO: ', result); 
        })
        .catch((erro) => {
            console.error('ERRO: ', erro);
        });
}


async function saveUser(message) {
    let user = {
        'pushname': (message['sender']['pushname'] != undefined) ? message['sender']['pushname'] : '',
        'whatsapp': (message.from).replace(/[^\d]+/g, '')
    }
    let newUser = firebasedb.save(user);
    return newUser;
}
