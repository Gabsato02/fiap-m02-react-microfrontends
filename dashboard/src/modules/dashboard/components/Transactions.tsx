import { useEffect, useState } from "react";
import { getTransactions } from "../services";
import { Transaction } from "../../../types";
import { formatDate } from "../../../utils";
import { useRecoilState } from "recoil";
import { transactionsState } from "../../../store/atoms";
import TransactionModalEdit from "./TransactionModalEdit";

export default function Transactions() {
  const TRANSACTION_TYPES = {
    all: "Todos",
    deposit: "Depósito",
    transfer: "Transferência",
    withdraw: "Saque",
    payment: "Pagamento",
  };

  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useRecoilState(transactionsState);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Estados para paginação
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getMonth = (date: string) => {
    const $d = new Date(date);
    return new Intl.DateTimeFormat("pt-BR", { month: "long" }).format($d);
  };

  const getCompleteDate = (date: string) => {
    const $d = new Date(date);
    const { hour, minute, day, month, year } = formatDate($d);
    return `${hour}h${String(minute).padStart(
      2,
      "0"
    )} - ${day}/${month}/${year}`;
  };

  const getTransactionsList = async (currentPage = 1) => {
    if (!hasMore) return;

    setLoading(true);
    try {
      const data = await getTransactions(`?page=${currentPage}&size=10`);

      // Acumular transações
      setTransactions((prevTransactions) => [
        ...prevTransactions,
        ...data.transactions,
      ]);

      // Verificar se há mais páginas
      setHasMore(data.transactions.length > 0);
    } catch (err) {
      console.log("errorGettingTransactions");
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(
    (transaction) =>
      (selectedFilter === "all" || transaction.type === selectedFilter) &&
      (transaction.description
        .toLowerCase()
        .includes(searchText.toLowerCase()) || // Busca no campo descrição
        String(transaction.amount).includes(searchText)) // Busca no campo valor
  );

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight - 100
    ) {
      if (!loading) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    getTransactionsList(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <h4 className="text-success">
        Extrato da conta
        <i className="ms-2 fa-solid fa-cash-register"></i>
      </h4>

      <div
        style={{ gap: 8, cursor: "pointer" }}
        className="d-flex flex-wrap py-3"
      >
        {Object.entries(TRANSACTION_TYPES).map(([key, value]) => (
          <span
            key={key}
            className={`badge rounded-pill bg-${
              key === selectedFilter ? "success" : "secondary"
            }`}
            onClick={() => setSelectedFilter(key)}
          >
            {value}
          </span>
        ))}
      </div>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar uma transação"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        ></input>
        <span className="input-group-text" id="basic-addon2">
          <i className="fa-solid fa-magnifying-glass"></i>
        </span>
      </div>

      {filteredTransactions.map((transaction: Transaction, index) => (
        <section className="list-group mt-3" key={index}>
          <div
            style={{ cursor: "pointer" }}
            className="list-group-item py-3"
            aria-current="true"
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <small>
                <strong className="text-success text-capitalize">
                  <i className="me-2 fa-solid fa-calendar-days"></i>
                  {getMonth(transaction.date)}
                </strong>
              </small>
              <div style={{ gap: 8 }} className="d-flex align-items-center">
                <span className="badge rounded-pill bg-secondary">
                  {TRANSACTION_TYPES[transaction.type]}
                </span>
                <i
                  className="fa-solid fa-edit text-success"
                  data-bs-toggle="modal"
                  data-bs-target="#transactionModalEdit"
                  onClick={() => handleEditClick(transaction)}
                ></i>
              </div>
            </div>
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center">
              <small className="text-capitalize">
                {transaction.description}
              </small>
              <small className="text-muted">
                {getCompleteDate(transaction.date)}
              </small>
            </div>
          </div>
        </section>
      ))}

      {loading && (
        <span
          className="spinner-border spinner-border-sm text-center mt-3 text-success d-block mx-auto"
          role="status"
          aria-hidden="true"
        ></span>
      )}

      {!loading && !hasMore && (
        <small className="d-block py-3 text-muted text-center">
          Todas as transações foram carregadas.
        </small>
      )}

      <TransactionModalEdit transaction={selectedTransaction} />
    </>
  );
}
