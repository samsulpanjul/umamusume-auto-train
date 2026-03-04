
type Props = {
  functionText: string;
  functionResults: number[];
};

export default function FunctionResultDisplay({ functionText, functionResults }: Props) {
  return (
          <>
            <div>
              <div className="border p-2">
              {functionText}
              </div>
              <div>
                  {functionResults.map((name, index) => (
                      <div className="border" key={index}>{name}</div>
                  ))}
              </div>
            </div>
          </>
  );
}
