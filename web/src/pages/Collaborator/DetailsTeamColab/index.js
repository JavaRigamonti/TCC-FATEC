import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";

import {
  getLocalStorage,
  setLocalStorage,
  clearLocalStorage,
} from "../../../utils/localStorage";
import isLeader from "../../../utils/isLeader";

import api from "../../../services/api";

import "./styles.css";

import { FaHashtag as Hash } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

import Header from "../../../components/Header";
import MenuLateral from "../../../components/MenuLateral";
import Container from "../../../components/Container";
import CardInformation from "../../../components/CardInformation";
import ButtonChangeScreen from "../../../components/ButtonChangeScreen";
import Loading from "../../../components/Loading";

import RoundGraph from "../../../components/RoundGraph";
import MembersList from "../../../components/MembersList";
import TeamMembersList from "../../../components/TeamMembersList";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DetailsTeamColab() {
  const [team, setTeam] = useState({});
  const [graph, setGraph] = useState({});
  const [loading, setLoading] = useState(true);
  const [ownerName, setOwnerName] = useState("");

  const history = useHistory();

  useEffect(() => {
    if (!!history.location?.state === false) {
      return history.push("/times");
    }

    const user = getLocalStorage("@Flush:user");
    const token = getLocalStorage("@Flush:token");
    const teamId = history.location.state.teamId;

    const fetchData = async () => {
      try {
        const response = await api.get(`teams/details/${teamId}/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTeam(response.data.team);
        setGraph(response.data.graph);

        setLocalStorage("@Flush:token", response.data.token);

        let owner = response.data.team.users.find((user) => {
          return user.is_owner === true;
        });
        setOwnerName(owner.name);

        setLoading(false);
      } catch (error) {
        clearLocalStorage();
        history.push("/", { error: 1 });
      }
    };

    fetchData();
  }, [history]);

  const handleCardClick = () => {
    let inputCopy = document.createElement("input");
    inputCopy.value = team.code;
    document.body.appendChild(inputCopy);
    inputCopy.select();
    try {
      document.execCommand("copy");
      toast.info("C??digo copiado.");
    } catch (err) {
      toast.error("Algum erro ocorreu ao tentar copiar o c??digo.");
    }

    document.body.removeChild(inputCopy);
  };

  const removeUserTeam = async (collaboratorId) => {
    const token = getLocalStorage("@Flush:token");

    try {
      await api.delete(`/teams/exit/${team.id}/${collaboratorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let newUsers = team.users.filter((user) => user.id !== collaboratorId);

      setTeam({ ...team, users: newUsers });
      toast.info("Colaborador removido com sucesso");
    } catch (error) {
      toast.error("Erro ao remover o colaborador");
    }
  };

  const toDailysPage = () => {
    history.push(`/times/daily/${team.name}`, {
      teamId: team.id,
      teamName: team.name,
      users: team.users,
    });
  };

  const toTasksPage = () => {
    history.push(`/times/tarefas/${team.name}`, {
      teamId: team.id,
      teamName: team.name,
      users: team.users,
    });
  };

  return (
    <div className="colaborador-detalhes-time">
      <Header />
      <MenuLateral homeActive={false} />
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <div className="colaborador-container-cards">
            <div className="colaborador-cards-header">
              <h1>{team.name}</h1>
              <div className="colaborador-header-buttons">
                <ButtonChangeScreen
                  titleButton={"Dailys"}
                  toPage={toDailysPage}
                />
                <ButtonChangeScreen
                  titleButton={"Tarefas"}
                  toPage={toTasksPage}
                />
              </div>
            </div>
            <div className="divider" />

            <div className="teamInfo-container">
              <Link className="backBtn" to={`/times`}>
                <MdArrowBack size={30} color={"#737FF3"} /> Voltar
              </Link>

              <div className="teamInfo">
                {ownerName && <p>Time criado por {ownerName}</p>}
              </div>
            </div>

            <div className="colaborador-area-cards">
              <CardInformation
                cardTitle="O c??digo do time"
                subTitle={team.code}
                number={<Hash size={22} />}
                buttonText="Clique para copiar o c??digo"
                isCopyable
                copyCode={handleCardClick}
              />
              <CardInformation
                crown
                cardTitle="O time possui"
                subTitle={
                  team.users?.length - 1 > 1 || team.users?.length - 1 === 0
                    ? "Membros"
                    : "Membro"
                }
                number={`${team.users?.length - 1}`}
                buttonText="Visualize os membros do time abaixo."
              />
              <CardInformation
                cardTitle="A categoria do time ??"
                subTitle={team.category}
                buttonText="Contate seu l??der para mais informa????es"
              />
            </div>
            <div className="colaborador-graph-area">
              {isLeader(team.users) ? (
                <TeamMembersList
                  collaborators={team.users}
                  removeUserTeam={removeUserTeam}
                />
              ) : (
                <MembersList users={team.users} />
              )}

              {!loading && (
                <RoundGraph
                  title="Tarefas"
                  description="Tarefas foram realizadas no total"
                  isPercent={false}
                  total={graph.total_tasks}
                  complete={graph.total_done_tasks}
                />
              )}
            </div>
          </div>
        </Container>
      )}
      <ToastContainer limit={3} />
    </div>
  );
}
