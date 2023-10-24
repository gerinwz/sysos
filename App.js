import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  ScrollView, 
  StyleSheet, 
  Button, 
  Modal, 
  TouchableOpacity, 
  ImageBackground,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import DatePicker from 'react-native-modern-datepicker';
import { getFormatedDate} from 'react-native-modern-datepicker';

const Field = ({ label, value, onChangeText }) => (
  <View>
    <Text>{label}:</Text>
    <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
  </View>
);

export default function OSForm() {
  const [formData, setFormData] = useState({
    dataEmissao: '',
    atendente: '',
    situacao: '',
    cliente: '',
    responsavelTecnico: '',
    dataSolicitacao: '',
    solicitante: '',
    descricaoSolicitacao: '',
    entradaMetalsoft: '',
    saidaMetalsoft: '',
    chegadaMetalsoft: '',
    entradaCliente: '',
    inicioAlmocoCliente: '',
    fimAlmocoCliente: '',
    saidaCliente: '',
    descricaoServicos: '',
    responsavelServicos: '',
    tipoServico: '',
    transporte: '',
    outros: '',
    observacao: '',
    assinaturaResponsavelMetalsoft: '',
    assinaturaResponsavelCliente: '',
    dataSelecionada: '',
    activeDateField: '', // Campo de data ativo
    isCalendarVisible: false, // Visibilidade do calendário
    calendarPosition: {}, // Posição do calendário
  });

  const handleDateFieldFocus = (fieldName, layout) => {
    const position = { top: layout.y + layout.height + 8, left: layout.x };
    setFormData({ ...formData, activeDateField: fieldName, isCalendarVisible: true, calendarPosition: position });
  };

  const handleDateSelect = (date) => setFormData({ ...formData, dataSelecionada: date.dateString });
  const [modalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const handleDateConfirm = () => {
    setFormData({ ...formData, [formData.activeDateField]: formData.dataSelecionada, activeDateField: '', isCalendarVisible: false });
  };

  const createCSV = async () => {
    // Lógica para criar o arquivo CSV com base nos dados do formData...
  };

  const handleLogin = () => {
    if (username === 'User' && password === '123456') {
      setLoggedIn(true);
      setModalVisible(false);
    } else {
      alert('Credenciais inválidas. Tente novamente.');
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setModalVisible(true);
  };

//DATA
  //Constante para abrir o Modal
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() - 30),
    "YYYY/MM/DD"
  );
  const [selectedStartDate, setSelectedStartDate] = useState("");
  const [startedDate, setStartedDate] = useState("12/12/2023");

  function handleChangeStartDate(propDate) {
    setStartedDate(propDate);
  }

  //Função para abrir 
  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
    (date) => setFormData({ ...formData, dataEmissao: date });
  };

  return (
    //Tela de Login
    <ImageBackground source={require('./logo.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        {!loggedIn ? (
          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <ImageBackground source={require('./logo.jpg')} style={styles.backgroundImage}>
                <View style={styles.loginContainer}>
                  <Text style={styles.infOs}>Faça o Login</Text>
                  <TextInput
                    placeholder="Nome de Usuário"
                    style={styles.input}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                  />
                  <TextInput
                    placeholder="Senha"
                    secureTextEntry
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                  />
                  <TouchableOpacity
                    style={styles.button}
                    onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
        ) : (
          //Informações OS
          <ScrollView style={styles.appBorder}>
            <Text style={styles.infOs}>Informações da OS</Text>
            <View>
              <Text style={{ fontSize: 14 }}>DATA EMISSÃO:</Text>
              <TouchableOpacity
                style={styles.inputBtn}
                onPress={handleOnPressStartDate}
              >
                <Text>{selectedStartDate}</Text>
              </TouchableOpacity>
            </View>
          

          {/* Create modal for date picker */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={openStartDatePicker}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <DatePicker
                  mode="calendar"
                  minimumDate={startDate}
                  selected={startedDate}
                  onDateChanged={handleChangeStartDate}
                  onSelectedChange={(date) => setSelectedStartDate(date)}
                  options={{
                    backgroundColor: "#080516",
                    textHeaderColor: "#469ab6",
                    textDefaultColor: "#FFFFFF",
                    selectedTextColor: "#FFF",
                    mainColor: "#469ab6",
                    textSecondaryColor: "#FFFFFF",
                    borderColor: "rgba(122, 146, 165, 0.1)",
                  }}
                />

                <TouchableOpacity onPress={handleOnPressStartDate}>
                  <Text style={{ color: "white" }}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      <Field label="Atendente" value={formData.atendente} onChangeText={(text) => setFormData({ ...formData, atendente: text })} />
      <Field label="Situacao" value={formData.situacao} onChangeText={(text) => setFormData({ ...formData, situacao: text })} />
      <Field label="Cliente" value={formData.cliente} onChangeText={(text) => setFormData({ ...formData, cliente: text })} />
      <Field label="Responsavel Tecnico" value={formData.responsavelTecnico} onChangeText={(text) => setFormData({ ...formData, responsavelTecnico: text })} />

      <Text style={styles.sectionLabel}>Solicitação Efetuada</Text>
      <TouchableOpacity onPress={() => handleDateFieldFocus('dataSolicitacao')}>
      <TextInput style={[styles.input, styles.roundedInput]} value={formData.dataSolicitacao} editable={false} />
      </TouchableOpacity>
      <Field label="Solicitante" value={formData.solicitante} onChangeText={(text) => setFormData({ ...formData, solicitante: text })} />
      <Field label="Descrição da Solicitação" value={formData.descricaoSolicitacao} onChangeText={(text) => setFormData({ ...formData, descricaoSolicitacao: text })} multiline />

      <Text style={styles.sectionLabel}>Quadro de Horários Metalsoft</Text>
      <Field label="Entrada" value={formData.entradaMetalsoft} onChangeText={(text) => setFormData({ ...formData, entradaMetalsoft: text })} />
      <Field label="Saída" value={formData.saidaMetalsoft} onChangeText={(text) => setFormData({ ...formData, saidaMetalsoft: text })} />
      <Field label="Chegada" value={formData.chegadaMetalsoft} onChangeText={(text) => setFormData({ ...formData, chegadaMetalsoft: text })} />

      <Text style={styles.sectionLabel}>Quadro de Horários Cliente</Text>
      <Field label="Entrada" value={formData.entradaCliente} onChangeText={(text) => setFormData({ ...formData, entradaCliente: text })} />
      <Field label="Início Almoço" value={formData.inicioAlmocoCliente} onChangeText={(text) => setFormData({ ...formData, inicioAlmocoCliente: text })} />
      <Field label="Fim Almoço" value={formData.fimAlmocoCliente} onChangeText={(text) => setFormData({ ...formData, fimAlmocoCliente: text })} />
      <Field label="Saída" value={formData.saidaCliente} onChangeText={(text) => setFormData({ ...formData, saidaCliente: text })} />

      <Text style={styles.sectionLabel}>Serviços Executados</Text>
      <Field label="Descrição" value={formData.descricaoServicos} onChangeText={(text) => setFormData({ ...formData, descricaoServicos: text })} multiline />
      <Field label="Responsável" value={formData.responsavelServicos} onChangeText={(text) => setFormData({ ...formData, responsavelServicos: text })} />
      <Field label="Tipo de Serviço" value={formData.tipoServico} onChangeText={(text) => setFormData({ ...formData, tipoServico: text })} />

      <Text style={styles.sectionLabel}>Outras Informações</Text>
      <Field label="Transporte" value={formData.transporte} onChangeText={(text) => setFormData({ ...formData, transporte: text })} />
      <Field label="Outros" value={formData.outros} onChangeText={(text) => setFormData({ ...formData, outros: text })} />
      <Field label="Observação" value={formData.observacao} onChangeText={(text) => setFormData({ ...formData, observacao: text })} multiline />

      <Text style={styles.sectionLabel}>Assinatura Responsável Metalsoft</Text>
      <Field label="Assinatura" value={formData.assinaturaResponsavelMetalsoft} onChangeText={(text) => setFormData({ ...formData, assinaturaResponsavelMetalsoft: text })} />

      <Text style={styles.sectionLabel}>Assinatura Responsável Cliente</Text>
      <Field label="Assinatura" value={formData.assinaturaResponsavelCliente} onChangeText={(text) => setFormData({ ...formData, assinaturaResponsavelCliente: text })} />
     
     
      <Button title="Sair" onPress={handleLogout} />
      <Button title="Gerar CSV" onPress={createCSV} />
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cor de fundo com transparência
  },
  loginContainer: {
    width: '100%', // Largura do modal
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin:'100%',
    marginVertical:'80%',
    justifyContent:"center"
  },
  appBorder: {
    width:'100%',
    padding:'5%',
    borderWidth: 2,
    borderColor: 'black',
  },
  botao: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  infOs: {
    margin:30,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  button: {
    backgroundColor: 'white', // Cor de fundo branca para os botões
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  loginButton: {
    marginTop: 20, // Espaçamento superior adicional
  },
  logoutButton: {
    marginTop: 20, // Espaçamento superior adicional
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    margin:10,
    fontWeight: 'bold',
    textAlign:"center"
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#222",
    height: 50,
    paddingLeft: 8,
    fontSize: 18,
    justifyContent: "center",
    marginTop: 14,
  },
  centeredView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#080516",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    padding: 35,
    width: "90%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
