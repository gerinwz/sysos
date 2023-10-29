//Main
import React, { useState } from "react";
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
} from "react-native";
import { Calendar } from "react-native-calendars";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import SignatureScreen from "react-native-signature-canvas";
import DateTimePicker from '@react-native-community/datetimepicker';

const Field = ({ label, value, onChangeText }) => (
  <View>
    <Text style={styles.label}>{label}:</Text>
    <TextInput style={styles.input} value={value} onChangeText={onChangeText} />
  </View>
);

export default function OSForm() {
  const [formData, setFormData] = useState({
    dataEmissao: "",
    atendente: "",
    situacao: "",
    cliente: "",
    responsavelTecnico: "",
    dataSolicitacao: "",
    solicitante: "",
    descricaoSolicitacao: "",
    entradaMetalsoft: "",
    saidaMetalsoft: "",
    chegadaMetalsoft: "",
    entradaCliente: "",
    inicioAlmocoCliente: "",
    fimAlmocoCliente: "",
    saidaCliente: "",
    descricaoServicos: "",
    responsavelServicos: "",
    tipoServico: "",
    transporte: "",
    outros: "",
    observacao: "",
    assinaturaResponsavelMetalsoft: "",
    assinaturaResponsavelCliente: "",
    dataSelecionada: "",
    activeDateField: "",
    isCalendarVisible: false,
    selectedDateField: null,
    isEntradaClientePickerVisible: false,
    calendarPosition: {},
  });
  // Função para abrir o modal de calendário
  const openCalendarModal = (field) => {
    setFormData({ ...formData, isCalendarVisible: true, selectedDateField: field });
  };

  const handleDateSelect = (date) => {
    const updatedField = formData.selectedDateField;
    setFormData({
      ...formData,
      [updatedField]: date.dateString,
      isCalendarVisible: false,
      selectedDateField: null,
    });
  };

  //Selecionar Atendente 'atendente'
  const [isAtendenteModalVisible, setAtendenteModalVisible] = useState(false);
  const atendente = ["Pedro", "Warley", "Rafael"];
  const selectAtendente = (atendente) => {
    setFormData({ ...formData, atendente });
    setAtendenteModalVisible(false);
  };
  const atendenteModal = (
    <Modal
      visible={isAtendenteModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackground}></View>
        <View style={styles.atendenteModalContent}>
          <Text style={styles.infOs}>Selecione o atendente</Text>
          {atendente.map((atendente, index) => (
            <Button
              key={index}
              title={atendente}
              onPress={() => selectAtendente(atendente)}
            />
          ))}
          <Button
            title="Close"
            onPress={() => setAtendenteModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );

  //Situação 'situacao'
  const [isSituacaoModalVisible, setSituacaoModalVisible] = useState(false);
  const situacao = ["Aberto", "Fechado"];
  const selectSituacao = (situacao) => {
    setFormData({ ...formData, situacao });
    setSituacaoModalVisible(false);
  };
  const situacaoModal = (
    <Modal
      visible={isSituacaoModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackground}></View>
        <View style={styles.atendenteModalContent}>
          <Text style={styles.infOs}>Selecione o atendente</Text>
          {situacao.map((situacao, index) => (
            <Button
              key={index}
              title={situacao}
              onPress={() => selectSituacao(situacao)}
            />
          ))}
          <Button
            title="Close"
            onPress={() => setSituacaoModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
  //CLIENTE
  const [isClienteModalVisible, setClienteModalVisible] = useState(false);
  const cliente = ["MetalSoft", "Estacio_de_Sá"];
  const selectCliente = (cliente) => {
    setFormData({ ...formData, cliente });
    setClienteModalVisible(false);
  };
  const clienteModal = (
    <Modal
      visible={isClienteModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackground}></View>
        <View style={styles.atendenteModalContent}>
          <Text style={styles.infOs}>Selecione o cliente</Text>
          {cliente.map((cliente, index) => (
            <Button
              key={index}
              title={cliente}
              onPress={() => selectCliente(cliente)}
            />
          ))}
          <Button title="Close" onPress={() => setClienteModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
  //Responsavel Tecnico
  const [isRespTecModalVisible, setRespTecModalVisible] = useState(false);
  const responsavelTecnico = ["Pedro", "Warley", "Rafael"];
  const selectRespTec = (responsavelTecnico) => {
    setFormData({ ...formData, responsavelTecnico });
    setRespTecModalVisible(false);
  };
  const responsavelTecnicoModal = (
    <Modal
      visible={isRespTecModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.responsavelTecnicoModalContent}>
          <Text style={styles.infOs}>Selecione Responsável Técnico</Text>
          {atendente.map((responsavelTecnico, index) => (
            <Button
              key={index}
              title={responsavelTecnico}
              onPress={() => selectRespTec(responsavelTecnico)}
            />
          ))}
          <Button title="Close" onPress={() => setRespTecModalVisible(false)} />
        </View>
      </View>
    </Modal>
  );
  const [modalVisible, setModalVisible] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleDateConfirm = () => {
    setFormData({
      ...formData,
      [formData.activeDateField]: formData.dataSelecionada,
      activeDateField: "",
      isCalendarVisible: false,
      dataEmissao: startedDate,
    });
  };
  // CRIAR CSV e anexar ao EMAIL
  const createCSV = async () => {
    try {
      const csvData = [
        "DataEmissao,Atendente,Situacao,Cliente,Responsavel Tecnico,Data Solicitacao,Solicitante,Descricao Solicitacao,Entrada Metalsoft,Saida Metalsoft,Chegada Metalsoft,Entrada Cliente,Inicio Almoco Cliente,Fim Almoco Cliente,Saida Cliente,Descricao Servicos,Responsavel Servicos,Tipo Servico,Transporte,Outros,Observacao,Assinatura Responsavel Metalsoft,Assinatura Responsavel Cliente",
        `${formData.dataEmissao},${formData.atendente},${formData.situacao},${formData.cliente},${formData.responsavelTecnico},${formData.dataSolicitacao},${formData.solicitante},${formData.descricaoSolicitacao},${formData.entradaMetalsoft},${formData.saidaMetalsoft},${formData.chegadaMetalsoft},${formData.entradaCliente},${formData.inicioAlmocoCliente},${formData.fimAlmocoCliente},${formData.saidaCliente},${formData.descricaoServicos},${formData.responsavelServicos},${formData.tipoServico},${formData.transporte},${formData.outros},${formData.observacao},${formData.assinaturaResponsavelMetalsoft},${formData.assinaturaResponsavelCliente}`,
      ];

      const csvString = csvData.join("\n");

      // Nome do arquivo CSV
      const fileName = "os_data.csv";

      // Caminho para a pasta onde você deseja salvar o arquivo (por exemplo, a raiz do sistema)
      const directory = FileSystem.documentDirectory;

      // Caminho completo do arquivo CSV
      const fileUri = `${directory}${fileName}`;

      // Use o Expo FileSystem para criar o arquivo CSV
      await FileSystem.writeAsStringAsync(fileUri, csvString, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      alert(`Arquivo CSV criado com sucesso em: ${fileUri}`);

      // Enviar o arquivo CSV por e-mail
      const emailSubject = "Assunto do E-mail";
      const emailBody = "Corpo do E-mail";
      const recipients = ["rogerinwz@icloud.com"]; // Adicione os destinatários desejados

      const attachments = [fileUri]; // Substitua 'fileUri' pelo caminho do arquivo CSV que você deseja anexar

      await MailComposer.composeAsync({
        subject: emailSubject,
        body: emailBody,
        recipients: recipients,
        attachments: attachments,
      });

      await MailComposer.composeAsync({
        subject: emailSubject,
        body: emailBody,
        recipients: recipients,
        attachments: [attachment],
      });
    } catch (error) {
      console.error("Erro ao criar o arquivo CSV:", error);
      alert(
        "Erro ao criar o arquivo CSV. Verifique o console para obter mais detalhes."
      );
    }
  };

  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [signature, setSignature] = useState(null);

  const openSignatureModal = () => {
    setIsSignatureModalOpen(true);
  };

  const onSaveSignature = (base64DataUrl) => {
    setSignature(base64DataUrl);
    setIsSignatureModalOpen(false);
  };

  const handleLogin = () => {
    if (username === "User" && password === "123456") {
      setLoggedIn(true);
      setModalVisible(false);
    } else {
      alert("Credenciais inválidas. Tente novamente.");
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setModalVisible(true);
  };
  //Responsavel pelo serviço 'responsavelServicos'
  const [
    isResponsavelServicosModalVisible,
    setResponsavelServicosModalVisible,
  ] = useState(false);
  const responsavelServicos = ["Pedro", "Warley", "Rafael"];
  const selectResponsavelServicos = (responsavelServicos) => {
    setFormData({ ...formData, responsavelServicos });
    setResponsavelServicosModalVisible(false);
  };
  const responsavelServicosModal = (
    <Modal
      visible={isResponsavelServicosModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackground}></View>
        <View style={styles.responsavelServicosModalContent}>
          <Text style={styles.infOs}>Selecione o responsavel pelo serviço</Text>
          {responsavelServicos.map((responsavelServicos, index) => (
            <Button
              key={index}
              title={responsavelServicos}
              onPress={() => selectResponsavelServicos(responsavelServicos)}
            />
          ))}
          <Button
            title="Close"
            onPress={() => setResponsavelServicosModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
  //HORA ENTRADA CLIENTE
  const openEntradaClienteTimePicker = () => {
    setFormData({ ...formData, isTimePickerVisible: true });
  };
  const [isTimePickerModalVisible, setTimePickerModalVisible] = useState(false);
  const [selectedEntradaClienteTime, setSelectedEntradaClienteTime] = useState(new Date());


  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const formattedTime = selectedTime.toLocaleTimeString();
      setFormData({ ...formData, entradaCliente: formattedTime, isTimePickerVisible: false });
    } else {
      setFormData({ ...formData, isTimePickerVisible: false });
    }
  };

  //TIPO DE SERVIÇO 'tipoServico'
  const [isTipoServicoModalVisible, setTipoServicoModalVisible] =
    useState(false);
  const tipoServico = [
    "A disposição",
    "Analise de sistemas",
    " Implantação ",
    "Visita Tecnica",
  ];
  const selectTpoServico = (tipoServico) => {
    setFormData({ ...formData, tipoServico });
    setTipoServicoModalVisible(false);
  };
  const tipoServicoModal = (
    <Modal
      visible={isTipoServicoModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackground}></View>
        <View style={styles.tipoServicoModalContent}>
          <Text style={styles.infOs}>Selecione o Tipo de serviço</Text>
          {tipoServico.map((tipoServico, index) => (
            <Button
              key={index}
              title={tipoServico}
              onPress={() => selectTpoServico(tipoServico)}
            />
          ))}
          <Button
            title="Close"
            onPress={() => setTipoServicoModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
  //FUNCÇAO TRANSPORTE 'transporte'
  const [isTransporteModalVisible, setTransporteModalVisible] = useState(false);
  const transporte = ["Locado", "Proprio", "Onibus", "Aereo"];
  const selectTransporte = (transporte) => {
    setFormData({ ...formData, transporte });
    setTransporteModalVisible(false);
  };
  const transporteModal = (
    <Modal
      visible={isTransporteModalVisible}
      animationType="slide"
      transparent={true}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackground}></View>
        <View style={styles.transporteModalContent}>
          <Text style={styles.infOs}>Selecione o Transporte</Text>
          {transporte.map((transporte, index) => (
            <Button
              key={index}
              title={transporte}
              onPress={() => selectTransporte(transporte)}
            />
          ))}
          <Button
            title="Close"
            onPress={() => setTransporteModalVisible(false)}
          />
        </View>
      </View>
    </Modal>
  );
  return (
    //INICIO LOGIN
    <ImageBackground
      source={require("./Metal.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {!loggedIn ? (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalBackground}></View>
              <ImageBackground
                source={require("./Metal.jpg")}
                style={styles.backgroundImage}
              >
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
                  <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </Modal>
        ) : (
          //FIM LOGIN
          //Inicio Ordem de serviço
          <ScrollView style={styles.appBorder}>
            <View style={styles.osInfoBackground}>
              <Text style={styles.infOs}>Ordem de Serviço MetalSoft</Text>
              {/*DATA EMISSÃO*/}
              <Field
                label="Data Emissão"
                value={formData.dataEmissao}
                onChangeText={(text) => setFormData({ ...formData, dataEmissao: text })}
                multiline
              />
              <Button
                title="Selecionar Data"
                onPress={() => openCalendarModal("dataEmissao")} // Passe o campo correspondente
              />
              <Modal
                animationType="slide"
                transparent={false}
                visible={formData.isCalendarVisible}
              >
                <View style={styles.modalContainer}>
                  <Calendar
                    onDayPress={(date) => handleDateSelect(date)} // Use a função atualizada
                  />
                  <Button
                    title="Fechar"
                    onPress={() => setFormData({ ...formData, isCalendarVisible: false, selectedDateField: null })}
                  />
                </View>
              </Modal>
              {/*FIM DATA EMISSÃO*/}
              {/*ATENDENTE*/}
              <View>
                <Text style={styles.label}>Atendente:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setAtendenteModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>{formData.atendente}</Text>
                </TouchableOpacity>
                {atendenteModal}
              </View>
              {/*FIM ATENDENTE*/}
              {/*SITUAÇÃO*/}
              <View>
                <Text style={styles.label}>Situação:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setSituacaoModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>{formData.situacao}</Text>
                </TouchableOpacity>
                {situacaoModal}
              </View>
              {/*FIM SITUAÇÃO*/}
              {/*CLIENTE*/}
              <View>
                <Text style={styles.label}>Cliente:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setClienteModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>{formData.cliente}</Text>
                </TouchableOpacity>
                {clienteModal}
              </View>
              {/*FIM CLIENTE*/}
              {/*RESPONSAVEL TECNICO*/}
              <View>
                <Text style={styles.label}>Responsável Tecnico:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setRespTecModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>
                    {formData.responsavelTecnico}
                  </Text>
                </TouchableOpacity>
                {responsavelTecnicoModal}
              </View>

              <Text style={styles.sectionLabel}>Solicitação Efetuada</Text>
              <Field
                label="Data da Solicitação"
                value={formData.dataSolicitacao}
                onChangeText={(text) =>
                  setFormData({ ...formData, dataSolicitacao: text })
                }
                multiline
              />
              <Field
                label="Solicitante"
                value={formData.solicitante}
                onChangeText={(text) =>
                  setFormData({ ...formData, solicitante: text })
                }
              />
              <Field
                label="Descrição da Solicitação"
                value={formData.descricaoSolicitacao}
                onChangeText={(text) =>
                  setFormData({ ...formData, descricaoSolicitacao: text })
                }
                multiline
              />

              <Text style={styles.sectionLabel}>
                Quadro de Horários
              </Text>
              <Text style={styles.sectionLabel}>
                Metalsoft
              </Text>
              <Text style={styles.sectionLabel}>
                Cliente
              </Text>
              {/* Hora Entrada Cliente */}
              <View>
                <Text style={styles.label}>Entrada Cliente:</Text>
                <TextInput
                  style={styles.input}
                  value={formData.entradaCliente}
                  editable={false}
                />
                <Button title="Escolher Hora" onPress={() => setTimePickerModalVisible(true)} />
              </View>

              {/* Modal do Seletor de Hora */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={isTimePickerModalVisible}
              >
                <View style={styles.timePickerContainer}>
                  <DateTimePicker
                    value={selectedEntradaClienteTime} // Use a variável de estado para definir o valor
                    mode="time"
                    is24Hour={true}
                    display="clock"
                    onChange={(event, selectedTime) => {
                      if (event.type === 'set') {
                        // Atualize a variável de estado e o estado formData com a hora selecionada
                        setSelectedEntradaClienteTime(selectedTime);
                        const formattedTime = `${selectedTime.getHours()}:${selectedTime.getMinutes()}`;
                        setFormData({ ...formData, entradaCliente: formattedTime });
                      }
                    }}
                  />
                  <Button title="Confirmar" onPress={() => setTimePickerModalVisible(false)} />
                </View>
              </Modal>
              {/* Fim Entrada Cliente */}
              <Field
                label="Início Almoço"
                value={formData.fimAlmocoCliente}
                onChangeText={(text) =>
                  setFormData({ ...formData, fimAlmocoCliente: text })
                }
              />
              <Field
                label="Fim Almoço"
                value={formData.fimAlmocoCliente}
                onChangeText={(text) =>
                  setFormData({ ...formData, fimAlmocoCliente: text })
                }
              />
              <Field
                label="Saída"
                value={formData.saidaCliente}
                onChangeText={(text) =>
                  setFormData({ ...formData, saidaCliente: text })
                }
              />

              <Text style={styles.sectionLabel}>Serviços Executados</Text>
              <Field
                label="Descrição"
                value={formData.descricaoServicos}
                onChangeText={(text) =>
                  setFormData({ ...formData, descricaoServicos: text })
                }
                multiline
              />
              {/* RESPONSAVEL */}
              <View>
                <Text style={styles.label}>Responsavel:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setResponsavelServicosModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>
                    {formData.responsavelServicos}
                  </Text>
                </TouchableOpacity>
                {responsavelServicosModal}
              </View>
              {/* RESPONSAVEL */}
              <View>
                <Text style={styles.label}>Tipo de Serviço:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setTipoServicoModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>{formData.tipoServico}</Text>
                </TouchableOpacity>
                {tipoServicoModal}
              </View>

              <Text style={styles.sectionLabel}>Outras Informações</Text>
              <View>
                <Text style={styles.label}>Transporte:</Text>
                <TouchableOpacity
                  style={styles.inputBtn}
                  onPress={() => setTransporteModalVisible(true)}
                >
                  <Text style={{ color: "white" }}>{formData.transporte}</Text>
                </TouchableOpacity>
                {transporteModal}
              </View>
              <Field
                label="Outros"
                value={formData.outros}
                onChangeText={(text) =>
                  setFormData({ ...formData, outros: text })
                }
              />
              <Field
                label="Observação"
                value={formData.observacao}
                onChangeText={(text) =>
                  setFormData({ ...formData, observacao: text })
                }
                multiline
              />

              <Text style={styles.sectionLabel}>
                Assinatura Responsável Metalsoft
              </Text>
              <Field
                label="Assinatura Resp. Metalsoft"
                value={
                  signature ? "Assinatura Capturada" : "Nenhuma Assinatura"
                }
                onChangeText={() => { }}
              />
              <Button
                title="Responsável Metalsoft Assinar"
                onPress={openSignatureModal}
              />
              <Modal
                animationType="slide"
                transparent={false}
                visible={isSignatureModalOpen}
              >
                <View style={styles.modalContainer}>
                  <SignatureScreen onSave={onSaveSignature} />
                  <Button
                    title="Fechar"
                    onPress={() => setIsSignatureModalOpen(false)}
                  />
                </View>
              </Modal>

              <Text style={styles.sectionLabel}>
                Assinatura Responsável Cliente
              </Text>
              <Field
                label="Assinatura Resp. Cliente"
                value={
                  signature ? "Assinatura Capturada" : "Nenhuma Assinatura"
                }
                onChangeText={() => { }}
              />
              <Button
                title="Responsável Cliente Assinar"
                onPress={openSignatureModal}
              />
              <Modal
                animationType="slide"
                transparent={false}
                visible={isSignatureModalOpen}
              >
                <View style={styles.modalContainer}>
                  <SignatureScreen onSave={onSaveSignature} />
                  <Button
                    title="Fechar"
                    onPress={() => setIsSignatureModalOpen(false)}
                  />
                </View>
              </Modal>

              <Button title="Sair" onPress={handleLogout} />
              <Button title="Gerar CSV" onPress={createCSV} />
            </View>
          </ScrollView>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "flex-center", // Alinhe o conteúdo no início (parte superior) do contêiner
    alignItems: "center", // Centralize horizontalmente
    paddingTop: 20, // Adicione um espaço superior para evitar que o conteúdo fique muito próximo à parte superior
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  modalBackground: {
    position: "cover",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
  },
  loginContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)", // Torne o fundo do modal mais transparente
    padding: 20,
    borderRadius: 10,
    margin: 50, // Isso parece estranho, talvez ajuste
    justifyContent: "center",
    height: 150,
  },
  appBorder: {
    width: "100%",
    padding: "5%",
    borderWidth: 2,
    borderColor: "black",
  },
  osInfoBackground: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  sectionLabel: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    textDecorationLine: "underline",
  },
  infOs: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  label: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  input: {
    height: 40,
    borderColor: "white", // Aumente o contraste da borda
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: "white",
  },
  button: {
    backgroundColor: "#469ab6", // Use uma cor que combine melhor com o estilo
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
    color: "black",
    fontSize: 16,
    margin: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  inputBtn: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#469ab6", // Cores mais legíveis
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
  atendenteOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  },
  timePickerContainer: {
    backgroundColor: 'white',
    alignItems: "center",
    marginTop: 300,
    padding: 80,
    borderRadius: 20,
  },
  closeButton: {},
});
