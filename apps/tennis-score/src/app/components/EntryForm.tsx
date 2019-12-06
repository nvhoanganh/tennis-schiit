import { Player, Mocked_Players } from "@tennis-score/api-interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "react-bootstrap/Table";
import React from "react";
import {
  faChartLine,
  faUserCircle,
  faSortAmountUp,
  faSortAmountDown,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

export interface IEntryFormProps {
  players: Player[];
  match: any;
}

const checkBoxStyle = {
  height: 30,
  marginTop: 3
};

const EntryForm: React.SFC<IEntryFormProps> = ({ players, match }) => {
  return (
    <div className="container">
      <h4 className="text-center pt-3">{match.params.group} - New Score</h4>
      <form>
        <div className="card">
          <div className="card-body">
            <Table size="sm">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-center">Winner</th>
                  <th className="text-center">Loser</th>
                </tr>
              </thead>
              <tbody>
                {players.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="row">
                        <div className="ml-3">
                          <FontAwesomeIcon
                            style={{ fontSize: "2rem" }}
                            icon={faUserCircle}
                          />
                        </div>
                        <div className="ml-2 mr-auto mt-1">{p.displayName}</div>
                      </div>
                    </td>
                    <td>
                      <input
                        className="form-control"
                        style={checkBoxStyle}
                        type="checkbox"
                        value={`w_${p.id}`}
                      />
                    </td>
                    <td>
                      <input
                        className="form-control"
                        style={checkBoxStyle}
                        type="checkbox"
                        value={`l_${p.id}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>

        <div className="card mt-3">
          <div className="card-body">
            <div className="card-title">Set won by losing team</div>
            <select className="custom-select mb-3">
              <option selected>0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
            <div className="card-title">Date</div>
            <input type="date" className="form-control" />
          </div>
        </div>
        <div className="text-center py-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

EntryForm.defaultProps = {
  players: Mocked_Players
};
export default EntryForm;
