import { Proposal } from '../../wrappers/nounsDao';
import { Alert, Button } from 'react-bootstrap';
import ProposalStatus from '../ProposalStatus';
import classes from './Ideas.module.css';
import { useHistory } from 'react-router-dom';
import { useEthers } from '@usedapp/core';
import { isMobileScreen } from '../../utils/isMobile';
import clsx from 'clsx';
import { useUserVotes } from '../../wrappers/nounToken';

const Ideas = ({ proposals }: { proposals: Proposal[] }) => {
  const history = useHistory();

  const { account } = useEthers();
  const connectedAccountNounVotes = useUserVotes() || 0;

  const isMobile = isMobileScreen();

  const nullStateCopy = () => {
    if (account !== null) {
      return 'You have no votes.';
    }
    return 'Connect wallet to submit an idea.';
  };

  return (
    <div className={classes.proposals}>
      <div>
        <h3 className={classes.heading}>Ideas</h3>
        {account !== undefined && connectedAccountNounVotes > 0 ? (
          <div className={classes.submitProposalButtonWrapper}>
            <Button className={classes.generateBtn} onClick={() => history.push('submit-idea')}>
              Submit Idea
            </Button>
          </div>
        ) : (
          <div className={clsx('d-flex', classes.submitProposalButtonWrapper)}>
            {!isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
            <div className={classes.nullBtnWrapper}>
              <Button className={classes.generateBtnDisabled}>Submit Idea</Button>
            </div>
          </div>
        )}
      </div>
      {isMobile && <div className={classes.nullStateCopy}>{nullStateCopy()}</div>}
      {proposals?.length ? (
        proposals
          .slice(0)
          .reverse()
          .map((p, i) => {
            return (
              <div
                className={classes.proposalLink}
                onClick={() => history.push(`/vote/${p.id}`)}
                key={i}
              >
                <span className={classes.proposalTitle}>
                  <span className={classes.proposalId}>{p.id}</span> <span>{p.title}</span>
                </span>
                <div className={classes.proposalStatusWrapper}>
                  <ProposalStatus status={p.status}></ProposalStatus>
                </div>
              </div>
            );
          })
      ) : (
        <Alert variant="secondary">
          <Alert.Heading>No ideas found.</Alert.Heading>
          <p>Ideas submitted by community members will appear here.</p>
        </Alert>
      )}
    </div>
  );
};
export default Ideas;
