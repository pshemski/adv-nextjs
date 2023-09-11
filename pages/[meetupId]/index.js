import MeetupDetails from '../../components/meetups/MeetupDetails';
import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';

export default function MeetupDetailsPage(props) {
  console.log(props.meetupData);
  return (
    <>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name='description' content={props.meetupData.description} />
      </Head>
      <MeetupDetails
        title={props.meetupData.title}
        address={props.meetupData.address}
        image={props.meetupData.image}
        description={props.meetupData.description}
      />
    </>
  );
}

export async function getStaticPaths() {
  const client = await MongoClient.connect(
    'mongodb+srv://new_user-43:changeme2023@cluster0.afroti8.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  const meetupsCollections = db.collection('meetups');

  const meetups = await meetupsCollections.find({}, { _id: 1 }).toArray();

  client.close();

  return {
    fallback: false,
    paths: meetups.map((meetup) => ({
      params: { meetupId: meetup._id.toString() },
    })),
  };
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId;

  const client = await MongoClient.connect(
    'mongodb+srv://new_user-43:changeme2023@cluster0.afroti8.mongodb.net/meetups?retryWrites=true&w=majority'
  );
  const db = client.db();

  console.log(db.collection('meetups'));

  const meetupsCollections = db.collection('meetups');

  const selectedMeetup = await meetupsCollections.findOne({
    _id: new ObjectId(meetupId),
  });

  client.close();

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        description: selectedMeetup.description,
        image: selectedMeetup.image,
        address: selectedMeetup.address,
      },
    },
  };
}
