import axios from 'axios';
import { type ServerlessFunctionConfig } from 'arjuna-sdk/application';
import { type stripeCustomer, type stripeEvent, type stripeStatus, type arjunaObject } from './types';

const ARJUNA_API_KEY: string = process.env.ARJUNA_API_KEY ?? '';
const ARJUNA_API_URL: string =
  process.env.ARJUNA_API_URL !== '' && process.env.ARJUNA_API_URL !== undefined
    ? `${process.env.ARJUNA_API_URL}/rest`
    : 'https://api.vedpragya.com/rest';
const STRIPE_API_KEY: string = process.env.STRIPE_API_KEY ?? '';
const STRIPE_API_URL: string = 'https://api.stripe.com/v1/customers';

const getArjunaCRMObjectData = async (
  objectSingularName: string,
): Promise<arjunaObject | undefined> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
    },
    url: `${ARJUNA_API_URL}/metadata/objects`,
  };
  try {
    const response = await axios.request(options);
    if (response.status === 200) {
      const companyObject = response.data.data.objects.find(
        (object: arjunaObject) => object.nameSingular === objectSingularName,
      );
      return (companyObject as arjunaObject) ?? ({} as arjunaObject);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const createFields = async (objectId: string, fieldName: string) => {
  const data =
    fieldName === 'seats'
      ? {
          type: 'NUMBER',
          objectMetadataId: objectId,
          name: 'seats',
          label: 'Seats',
          icon: 'IconMan',
        }
      : {
          type: 'SELECT',
          objectMetadataId: objectId,
          name: 'subStatus',
          label: 'Sub Status',
          icon: 'IconStatusChange',
          options: [
            {
              color: 'iris',
              label: 'Incomplete',
              value: 'INCOMPLETE',
              position: 1,
            },
            {
              color: 'sky',
              label: 'Incomplete (expired)',
              value: 'INCOMPLETE_EXPIRED',
              position: 2,
            },
            {
              color: 'amber',
              label: 'Trialing',
              value: 'TRIALING',
              position: 3,
            },
            {
              color: 'green',
              label: 'Active',
              value: 'ACTIVE',
              position: 4,
            },
            {
              color: 'orange',
              label: 'Past due',
              value: 'PAST_DUE',
              position: 5,
            },
            {
              color: 'brown',
              label: 'Canceled',
              value: 'CANCELED',
              position: 6,
            },
            {
              color: 'red',
              label: 'Unpaid',
              value: 'UNPAID',
              position: 7,
            },
            {
              color: 'gray',
              label: 'Paused',
              value: 'PAUSED',
              position: 8,
            },
          ],
        };

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${ARJUNA_API_URL}/metadata/fields`,
    data: data,
  };
  try {
    const response = await axios(options);
    return response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const getStripeCustomerData = async (
  customerID: string,
): Promise<stripeCustomer | undefined> => {
  const options = {
    method: 'GET',
    url: `${STRIPE_API_URL}/${customerID}`,
    auth: {
      username: STRIPE_API_KEY,
      password: '',
    },
  };
  try {
    const response = await axios(options);
    return response.status === 200
      ? ({
          name: response.data.name,
          businessName: response.data.business_name,
          email: response.data.email,
        } as stripeCustomer)
      : ({} as stripeCustomer);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const checkIfCompanyExistsInArjunaCRM = async (
  name: string | undefined,
): Promise<string | undefined> => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
    },
    url: `${ARJUNA_API_URL}/companies?filter=name%5Beq%5D%3A%22${name}%22`,
  };
  try {
    const response = await axios(options);
    return response.status === 200 &&
      response.data.data.companies[0].id !== undefined
      ? (response.data.data.companies[0].id as string)
      : '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const updateArjunaCRMCompany = async (
  companyId: string | undefined,
  seats: number | null,
  subStatus: stripeStatus,
): Promise<boolean | undefined> => {
  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${ARJUNA_API_URL}/companies/${companyId}`,
    data: {
      seats: seats,
      subStatus: subStatus,
    },
  };
  try {
    const response = await axios(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const createArjunaCRMCompany = async (
  customerName: string | undefined,
  seats: number | null,
  subStatus: string,
): Promise<string | undefined> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${ARJUNA_API_URL}/companies`,
    data: {
      name: customerName,
      seats: seats,
      subStatus: subStatus,
    },
  };
  try {
    const response = await axios(options);
    return response.status === 201 ? (response.data.data.id as string) : '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const checkIfStripePersonExistsInArjunaCRM = async (email: string | null) => {
  const options = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${ARJUNA_API_URL}/people?filter=emails.primaryEmail%5Beq%5D%3A%22${email}%22`, // mail is unique by default so there can be only 1 person with given mail
  };
  try {
    const response = await axios.request(options);
    return response.status === 200 &&
      response.data.data.people[0].id !== undefined
      ? (response.data.data.people[0].id as string)
      : '';
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const addArjunaCRMPerson = async (
  firstName: string,
  lastName: string,
  email: string,
  companyId: string,
  seats: number,
  subStatus: stripeStatus,
): Promise<boolean | undefined> => {
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${ARJUNA_API_URL}/people`,
    data: {
      firstName: firstName,
      lastName: lastName,
      emails: { primaryEmail: email },
      companyId: companyId,
      seats: seats,
      subStatus: subStatus,
    },
  };
  try {
    const response = await axios.request(options);
    return response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

const updateArjunaCRMPerson = async (
  id: string,
  seats: number,
  subStatus: stripeStatus,
): Promise<boolean | undefined> => {
  const options = {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${ARJUNA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    url: `${ARJUNA_API_URL}/people/${id}`,
    data: {
      seats: seats,
      subStatus: subStatus,
    },
  };
  try {
    const response = await axios.request(options);
    return response.status === 200;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    }
  }
};

export const main = async (
  params: Record<string, any>,
): Promise<object | undefined> => {
  if (ARJUNA_API_KEY === '' || STRIPE_API_KEY === '') {
    throw new Error('Missing variables');
  }

  try {
    // TODO: add validation of signature key from Stripe (not possible at the moment as headers aren't accessible in serverless functions)
    const stripe = params as stripeEvent;
    const allowed_types: string[] = [
      'customer.subscription.created',
      'customer.subscription.updated',
    ];
    if (!allowed_types.includes(stripe.type)) {
      throw new Error('Wrong type of webhook');
    }

    const stripeCustomer: stripeCustomer | undefined =
      await getStripeCustomerData(stripe.data.object.customer);
    if (
      stripeCustomer?.businessName === undefined ||
      stripeCustomer?.businessName === ''
    ) {
      console.warn('Set customer business name in Stripe');
      return {};
    }

    const companyObject = await getArjunaCRMObjectData('company');
    if (
      companyObject?.fields.find((field) => field.name === 'seats') ===
      undefined
    ) {
      const seatsFieldCreated: boolean | undefined = companyObject?.id
        ? await createFields(companyObject?.id, 'seats')
        : false;
      if (!seatsFieldCreated) {
        throw new Error('Seats field creation in Company object failed');
      } else {
        console.info('Seats field creation in Company object succeeded');
      }
    }
    if (
      companyObject?.fields.find((field) => field.name === 'subStatus') ===
      undefined
    ) {
      const subStatusFieldCreated: boolean | undefined = companyObject?.id
        ? await createFields(companyObject?.id, 'subStatus')
        : false;
      if (!subStatusFieldCreated) {
        throw new Error('Sub status field creation in Company object failed');
      } else {
        console.info('Sub status field creation in Company object succeeded');
      }
    }

    const personObject = await getArjunaCRMObjectData('person');
    if (
      personObject?.fields.find((field) => field.name === 'seats') === undefined
    ) {
      const seatsFieldCreated: boolean | undefined = personObject?.id
        ? await createFields(personObject?.id, 'seats')
        : false;
      if (!seatsFieldCreated) {
        throw new Error('Seats field creation in People object failed');
      } else {
        console.info('Seats field creation in People object succeeded');
      }
    }
    if (
      personObject?.fields.find((field) => field.name === 'subStatus') ===
      undefined
    ) {
      const subStatusFieldCreated: boolean | undefined = personObject?.id
        ? await createFields(personObject?.id, 'subStatus')
        : false;
      if (!subStatusFieldCreated) {
        throw new Error('Sub status field creation in People object failed');
      } else {
        console.info('Sub status field creation in People object succeeded');
      }
    }

    const arjunaCompanyId: string | undefined =
      await checkIfCompanyExistsInArjunaCRM(stripeCustomer?.businessName);
    const seats: number =
      stripe.data.object.quantity ??
      stripe.data.object.items.data.reduce(
        (acc, item) => acc + item.quantity,
        0,
      ); // we don't know if subscription has only 1 item (product) or more
    let updatedArjunaCRMCompanyId: string | undefined;
    if (arjunaCompanyId === '') {
      const arjunaCompanyCreated: string | undefined =
        await createArjunaCRMCompany(
          stripeCustomer?.businessName,
          seats,
          stripe.data.object.status.toUpperCase(),
        );
      if (arjunaCompanyCreated === '') {
        throw new Error('Creation of Stripe customer in ArjunaCRM failed');
      } else {
        console.log('Creation of Stripe customer in ArjunaCRM succeeded');
        updatedArjunaCRMCompanyId = arjunaCompanyCreated;
      }
    } else {
      const arjunaCompanyUpdated: boolean | undefined =
        await updateArjunaCRMCompany(
          arjunaCompanyId,
          seats,
          stripe.data.object.status.toUpperCase() as stripeStatus,
        );
      if (!arjunaCompanyUpdated) {
        throw new Error('Update of Stripe customer in ArjunaCRM failed');
      } else {
        console.log('Update of Stripe customer in ArjunaCRM succeeded');
        updatedArjunaCRMCompanyId = arjunaCompanyId;
      }
    }

    if (updatedArjunaCRMCompanyId === undefined || updatedArjunaCRMCompanyId === '') {
      throw new Error('ArjunaCRMCompanyId not found');
    } else {
      const stripeCustomerInArjunaCRM: string | undefined =
        await checkIfStripePersonExistsInArjunaCRM(stripeCustomer.email);
      if (stripeCustomerInArjunaCRM === '') {
        if (!stripeCustomer.name) {
          throw new Error('Missing Stripe customer first or last name');
        }
        if (!stripeCustomer.email) {
          throw new Error('Missing Stripe customer email');
        }
        const firstName: string = stripeCustomer.name?.split(' ')[0];
        const lastName: string = stripeCustomer.name?.split(' ')[1];
        const addedStripePersonToArjunaCRM: boolean | undefined =
          await addArjunaCRMPerson(
            firstName,
            lastName,
            stripeCustomer.email,
            updatedArjunaCRMCompanyId,
            seats,
            stripe.data.object.status.toUpperCase() as stripeStatus,
          );
        if (!addedStripePersonToArjunaCRM) {
          throw new Error('Adding Stripe person to ArjunaCRM failed');
        } else {
          console.log('Stripe person was added to ArjunaCRM');
        }
      } else if (stripeCustomerInArjunaCRM !== undefined) {
        const updatedStripePersonInArjunaCRM: boolean | undefined =
          await updateArjunaCRMPerson(
            stripeCustomerInArjunaCRM,
            seats,
            stripe.data.object.status.toUpperCase() as stripeStatus,
          );
        if (!updatedStripePersonInArjunaCRM) {
          throw new Error('Update of Stripe person in ArjunaCRM failed');
        } else {
          console.log('Update of Stripe person in ArjunaCRM succeeded');
        }
      } else {
        throw new Error('ArjunaCRM not found');
      }
    }
    return {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.message);
      return {};
    }
    console.error(error);
    return {};
  }
};

export const config: ServerlessFunctionConfig = {
  universalIdentifier: 'cd15a738-18a5-406e-8b83-959dc52ebe14',
  name: 'stripe',
  triggers: [
    {
      universalIdentifier: '55f58e19-d832-43c4-9f8b-3f29fc05c162',
      type: 'route',
      path: '/webhook/stripe',
      httpMethod: 'POST',
      isAuthRequired: false,
    },
  ],
};
