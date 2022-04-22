import { Form, Input, Button } from "semantic-ui-react";

const CreateTransaction = ({ createTransfer, value, setValue, loadingBtn }) => {
  return (
    <Form onSubmit={createTransfer}>
      <Form.Field>
        <label htmlFor="amount">
          <b>Amount [ETH]:</b>
        </label>
        <Input
          type="text"
          id="amount"
          placeholder="Enter amount in ether"
          value={value.amount}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Form.Field>
        <label htmlFor="to">
          <b>To:</b>
        </label>
        <Input
          type="text"
          id="to"
          placeholder="Enter address of beneficiary"
          value={value.to}
          onChange={(e) => setValue(e.target.value)}
        />
      </Form.Field>
      <Button primary loading={loadingBtn}>
        Create
      </Button>
    </Form>
  );
};

export default CreateTransaction;
