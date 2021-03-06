import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";

import "./styles.css";

import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import Container from "../../../components/Container";
import Kanban from "../../../components/Kanban";
import ButtonChangeScreen from "../../../components/ButtonChangeScreen";
import Loading from "../../../components/Loading";

import { ToastContainer, toast } from "react-toastify";

import {
  clearLocalStorage,
  getLocalStorage,
  setLocalStorage,
} from "../../../utils/localStorage";

import api from "../../../services/api";

import moment from "moment";
import "moment/locale/pt-br";

export default function TeamKanban() {
  const [tasksColumns, setTasksColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();
  const user = getLocalStorage("@Flush:user");

  useEffect(() => {
    if (!!history.location?.state === false) {
      return history.push("/times");
    }

    const { teamId, boardId } = history.location.state;

    const fetchTasksColumns = async () => {
      const token = getLocalStorage("@Flush:token");

      try {
        const response = await api.get(
          `/tasks/contents/${teamId}/${boardId}/${user.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setLocalStorage("@Flush:token", response.data.token);

        setTasksColumns(response.data.tasks);
        setLoading(false);
      } catch (error) {
        clearLocalStorage();
        history.push("/");
      }
    };

    fetchTasksColumns();
  }, [user.id, history]);

  const deleteTask = async (taskId) => {
    const { teamId, boardId } = history.location.state;
    const token = getLocalStorage("@Flush:token");

    try {
      await api.delete(
        `/tasks/contents/${teamId}/${boardId}/${taskId}/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const filteredColumns = tasksColumns.map((column) => {
        const tasks = column.tasks.filter((task) => task.id !== taskId);
        return {
          ...column,
          tasks,
        };
      });

      setTasksColumns(filteredColumns);
      toast.success("Tarefa deletada com sucesso");
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    }
  };

  const toTasksColabPage = () => {
    const { teamId, users, teamName } = history.location.state;
    history.push(`/times/tarefas/${teamName}`, { teamName, users, teamId });
  };

  const toDetailTeamPage = () => {
    const { teamId, teamName } = history.location.state;
    history.push(`/times/detalhes/${teamName}`, { teamId });
  };

  const toDailysPage = () => {
    const { teamId, users, teamName } = history.location.state;

    history.push(`/times/daily/${teamName}`, { teamId, users, teamName });
  };

  const createTask = async (data) => {
    const { teamId, boardId } = history.location.state;
    const token = getLocalStorage("@Flush:token");
    try {
      const response = await api.post(
        `/tasks/contents/${teamId}/${boardId}/${user.id}`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newTasksColumn = tasksColumns.map((column) => {
        if (`${column.id}` === `${data.task_column}`) {
          const tasks = [response.data.content, ...column.tasks];

          return {
            ...column,
            tasks,
          };
        }
        return column;
      });

      setTasksColumns(newTasksColumn);
    } catch (error) {
      toast.error("Ocorreu um erro inesperado");
    }
  };

  const moveTask = async (columnId, taskId) => {
    const { teamId } = history.location.state;

    const token = getLocalStorage("@Flush:token");
    try {
      const response = await api.put(
        `/tasks/contents/${teamId}/${taskId}/${user.id}`,
        { columnId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setLocalStorage("@Flush:token", response.data.token);
    } catch (error) {
      toast.error("Aconteceu um erro inesperado");
    }
  };

  return (
    <div className="containerKanbanTeam">
      <Header />
      <MenuLateral homeActive={false} />
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <div className="colaborador-cards-header">
            <div className="bloco-header-titles">
              <p>Tarefas</p>
              <span onClick={toDetailTeamPage}>
                {history.location?.state?.teamName}
              </span>
            </div>
            <div className="colaborador-header-buttons">
              <ButtonChangeScreen
                titleButton={"Dailys"}
                toPage={toDailysPage}
              />
              <ButtonChangeScreen titleButton={"Tarefas"} active />
            </div>
          </div>
          <div className="teams-divider" />
          <div className="boardInfo-container">
            <div className="backBtn" onClick={toTasksColabPage}>
              <MdArrowBack size={30} color={"#737FF3"} /> Voltar
            </div>
            <div className="boardInfo">
              <h2>{history.location?.state?.boardName}</h2>
              <h4>
                Criado em{" "}
                {moment(history.location?.state?.boardDate).format(
                  "DD/MM/YYYY"
                )}
              </h4>
            </div>
          </div>
          <Kanban
            tasksColumns={tasksColumns}
            deleteTask={deleteTask}
            createTask={createTask}
            moveTask={(columnId, taskId) => moveTask(columnId, taskId)}
          />
        </Container>
      )}
      <ToastContainer />
    </div>
  );
}
