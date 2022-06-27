import { Col, Row } from 'react-bootstrap';
import Section from '../../layout/Section';
import { useAllProposals, useProposalThreshold } from '../../wrappers/nounsDao';
import Ideas from '../../components/Ideas';
import classes from './Ideas.module.css';
import { utils } from 'ethers/lib/ethers';
import clsx from 'clsx';
import { useTreasuryBalance, useTreasuryUSDValue } from '../../hooks/useTreasuryBalance';

import NounImageInllineTable from '../../components/NounImageInllineTable';
import { isMobileScreen } from '../../utils/isMobile';
import config from '../../config';
import { useEffect, useState } from 'react';
import { createClient } from 'urql';

const IdeasPage = () => {
  const { data: proposals } = useAllProposals();
  const threshold = useProposalThreshold();
  const nounsRequired = threshold !== undefined ? threshold + 1 : '...';
  const nounThresholdCopy = `${nounsRequired} ${threshold === 0 ? 'Lil Noun' : 'Lil Nouns'}`;

  const treasuryBalance = useTreasuryBalance();
  const treasuryBalanceUSD = useTreasuryUSDValue();

  const isMobile = isMobileScreen();

  const [bigNounBalance, setBigNounBalance] = useState('0');
  const [bigNounIds, setBigNounIds] = useState([]);

  const fetchNounsQuery = `
  query {
      accounts(where: {id: "0xd5f279ff9eb21c6d40c8f345a66f2751c4eea1fb" }) {
      id
      tokenBalance
      nouns {
        id
      }
    }
  }
    `;

  async function fetchData() {
    const repsonse = await createClient({ url: config.app.nounsDAOSubgraphApiUri })
      .query(fetchNounsQuery)
      .toPromise();
    return repsonse.data.accounts[0];
  }

  useEffect(() => {
    fetchData()
      .then(async repsonse => {
        const tokenBalance = repsonse.tokenBalance;
        const nounIds = repsonse.nouns.flatMap((obj: { id: any }) => obj.id);

        setBigNounBalance(tokenBalance);
        setBigNounIds(nounIds);
        return;
      })
      .catch(error => {
        console.log(`Nouns Owned Error ${error}`);
        return;
      });
  }, []);

  return (
    <Section fullWidth={false} className={classes.section}>
      <Col lg={10} className={classes.wrapper}>
        <Row className={classes.headerRow}>
          <span>Contribute</span>
          <h1>Submit &amp; Vote on New Ideas</h1>
        </Row>
        <p className={classes.subheading}>
          A minimum of <span className={classes.boldText}>1 Lil Noun</span> is required to submit an
          idea and vote on others. There's no limit to the number of ideas you can submit and vote
          on.
        </p>

        <Ideas proposals={proposals} />
      </Col>
    </Section>
  );
};
export default IdeasPage;
