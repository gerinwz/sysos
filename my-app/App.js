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
    calendarPosition: {},
  });

  const handleDateFieldFocus = (fieldName, layout) => {
    const position = { top: layout.y + layout.height + 8, left: layout.x };
    setFormData({
      ...formData,
      activeDateField: fieldName,
      isCalendarVisible: true,
      calendarPosition: position,
    });
  };

  const handleDateSelect = (date) =>
    setFormData({ ...formData, dataSelecionada: date.dateString });
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
    });
  };

  const createCSV = async () => {
    try {
      const csvData = [
        "Data Emissao,Atendente,Situacao,Cliente,Responsavel Tecnico,Data Solicitacao,Solicitante,Descricao Solicitacao,Entrada Metalsoft,Saida Metalsoft,Chegada Metalsoft,Entrada Cliente,Inicio Almoco Cliente,Fim Almoco Cliente,Saida Cliente,Descricao Servicos,Responsavel Servicos,Tipo Servico,Transporte,Outros,Observacao,Assinatura Responsavel Metalsoft,Assinatura Responsavel Cliente",
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

      const attachment = {
        uri: fileUri, // Caminho completo do arquivo CSV
        mimeType: "text/csv",
        filename: "os_data.csv", // Nome do arquivo no e-mail
      };

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

  return (
    <ImageBackground
      source={require("./logo.jpg")}
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
                source={require("./logo.jpg")}
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
          <ScrollView style={styles.appBorder}>
            <View style={styles.osInfoBackground}>
              <Text style={styles.infOs}>Ordem de Serviço MetalSoft</Text>
              <Field
                label="Data Emissao"
                value={formData.dataEmissao}
                onChangeText={(text) =>
                  setFormData({ ...formData, dataEmissao: text })
                }
              />
              <Field
                label="Atendente"
                value={formData.atendente}
                onChangeText={(text) =>
                  setFormData({ ...formData, atendente: text })
                }
              />
              <Field
                label="Situacao"
                value={formData.situacao}
                onChangeText={(text) =>
                  setFormData({ ...formData, situacao: text })
                }
              />
              <Field
                label="Cliente"
                value={formData.cliente}
                onChangeText={(text) =>
                  setFormData({ ...formData, cliente: text })
                }
              />
              <Field
                label="Responsavel Tecnico"
                value={formData.responsavelTecnico}
                onChangeText={(text) =>
                  setFormData({ ...formData, responsavelTecnico: text })
                }
              />

              <Text style={styles.sectionLabel}>Solicitação Efetuada</Text>
              <TouchableOpacity
                onPress={() => handleDateFieldFocus("dataSolicitacao")}
              >
                <TextInput
                  style={[styles.input, styles.roundedInput]}
                  value={formData.dataSolicitacao}
                  editable={false}
                />
              </TouchableOpacity>
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
                Quadro de Horários Cliente
              </Text>
              <Field
                label="Entrada"
                value={formData.entradaCliente}
                onChangeText={(text) =>
                  setFormData({ ...formData, entradaCliente: text })
                }
              />
              <Field
                label="Início Almoço"
                value={formData.inicioAlmocoCliente}
                onChangeText={(text) =>
                  setFormData({ ...formData, inicioAlmocoCliente: text })
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
              <Field
                label="Responsável"
                value={formData.responsavelServicos}
                onChangeText={(text) =>
                  setFormData({ ...formData, responsavelServicos: text })
                }
              />
              <Field
                label="Tipo de Serviço"
                value={formData.tipoServico}
                onChangeText={(text) =>
                  setFormData({ ...formData, tipoServico: text })
                }
              />

              <Text style={styles.sectionLabel}>Outras Informações</Text>
              <Field
                label="Transporte"
                value={formData.transporte}
                onChangeText={(text) =>
                  setFormData({ ...formData, transporte: text })
                }
              />
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
                label="Assinatura"
                value={formData.assinaturaResponsavelMetalsoft}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    assinaturaResponsavelMetalsoft: text,
                  })
                }
              />

              <Text style={styles.sectionLabel}>
                Assinatura Responsável Cliente
              </Text>
              <Field
                label="Assinatura"
                value={formData.assinaturaResponsavelCliente}
                onChangeText={(text) =>
                  setFormData({
                    ...formData,
                    assinaturaResponsavelCliente: text,
                  })
                }
              />

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
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loginContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    padding: 20,
    borderRadius: 10,
    margin: "50%",
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
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    color: "white",
  },
  button: {
    backgroundColor: "white", // Cor de fundo branca para os botões
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
});
