interface ITextInput {
  onChange: (text: string) => void;
}

const TextInput = ({ onChange }: ITextInput) => {
  return (
    <input
      type="text"
      className="border p-4 rounded-lg"
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default TextInput;
