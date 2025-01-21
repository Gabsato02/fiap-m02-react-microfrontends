import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { useRecoilState } from "recoil";
import {
  createTransaction,
  editTransaction,
  getTransactions,
  getUser,
} from "../services";
import { closeModal } from "../../../utils";
import { transactionsState, userInfoAtom } from "../../../store/atoms";

type TransactionForm = {
  description: string;
  amount: string;
  type: string;
};

export default function TransactionModalEdit({ transaction }) {
  const [loading, setLoading] = React.useState(false);
  const [transactions, setTransactions] = useRecoilState(transactionsState);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TransactionForm>({ mode: "onChange" });

  useEffect(() => {
    if (transaction) {
      reset(transaction);
    }
  }, [transaction, reset]);

  const handleEditTransaction = async (form: TransactionForm) => {
    try {
      const { description } = form;

      const payload = {
        description,
      };

      // Atualizar a transação
      await editTransaction(payload, transaction.id);

      // Obter todas as transações
      const allTransactions = await getTransactions();
      setTransactions(allTransactions.transactions);

      // Atualizar informações do usuário
      const newUserInfo = await getUser();
      setUserInfo(newUserInfo);

      // Resetar o formulário
      reset({
        description: "",
        amount: "",
        type: "",
      });

      closeModal("transactionModalEdit");
    } catch (err) {
      console.error("Erro ao editar transação: ", err);
    }
  };

  return (
    <div
      className="modal fade"
      id="transactionModalEdit"
      tabIndex={-1}
      aria-labelledby="transactionModalLabelEdit"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="transactionModalLabel">
              Editar Transação
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form
              className="mt-3"
              noValidate
              onSubmit={handleSubmit(handleEditTransaction)}
            >
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Descrição
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.description && "is-invalid"
                  }`}
                  id="description"
                  placeholder="Digite a descrição"
                  {...register("description", {
                    required: "Descrição é obrigatória",
                  })}
                />
                {errors.description && (
                  <div className="invalid-feedback">
                    {errors.description.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Valor
                </label>
                <Controller
                  name="amount"
                  control={control}
                  rules={{ required: "O valor é obrigatório" }}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      className={`form-control ${
                        errors.amount && "is-invalid"
                      }`}
                      id="amount"
                      placeholder="R$ 0,00"
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      allowNegative={false}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      onValueChange={(values) => {
                        field.onChange(values.value);
                      }}
                      disabled
                    />
                  )}
                />
                {errors.amount && (
                  <div className="invalid-feedback">
                    {errors.amount.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="type" className="form-label">
                  Tipo
                </label>
                <select
                  className={`form-control ${errors.type && "is-invalid"}`}
                  id="type"
                  {...register("type", { required: "O tipo é obrigatório" })}
                  disabled
                >
                  <option value="">Selecione o tipo</option>
                  <option value="deposit">Depósito</option>
                  <option value="transfer">Transferência</option>
                  <option value="withdraw">Saque</option>
                  <option value="payment">Pagamento</option>
                </select>
                {errors.type && (
                  <div className="invalid-feedback">{errors.type.message}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
