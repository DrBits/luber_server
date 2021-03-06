import { Resolvers } from 'types/resolvers';
import privateResolver from '../../../utils/privateResolver';
import User from '../../../entities/User';
import {
  UpdateRideStatusMutationArgs,
  UpdateRideStatusReponse
} from '../../../types/graph';
import Ride from '../../../entities/Ride';
import Chat from '../../../entities/Chat';

const resolvers: Resolvers = {
  Mutation: {
    UpdateRideStatus: privateResolver(
      async (
        _,
        args: UpdateRideStatusMutationArgs,
        { req, pubSub }
      ): Promise<UpdateRideStatusReponse> => {
        const user: User = req.user;
        if (user.isDriving) {
          try {
            let ride: Ride | undefined;
            if (args.status === 'ACCEPTED') {
              ride = await Ride.findOne({
                id: args.rideId,
                status: 'REQUESTING'
              });
              if (ride) {
                ride.driver = user;
                user.isTaken = true;
                user.save();
                const chat = await Chat.create({
                  driver: user,
                  passenger: ride.passenger
                }).save();
                ride.chat = chat;
                ride.save();
              }
            } else {
              ride = await Ride.findOne({
                id: args.rideId,
                driver: user
              });
            }

            if (ride) {
              ride.status = args.status;
              ride.save();
              pubSub.publish('rideUpdate', { RideStatusSubscription: ride });
              return {
                ok: true,
                error: null
              };
            } else {
              return {
                ok: false,
                error: 'Cant update ride'
              };
            }
          } catch (error) {
            return {
              ok: false,
              error: error.message
            };
          }
        } else {
          return {
            ok: false,
            error: 'You are not driver'
          };
        }
      }
    )
  }
};

export default resolvers;
