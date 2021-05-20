import FirebaseIntegration from './FirebaseIntegration';

export default class CreateToDoListService {
    execute(toDoList) {
        return new Promise((resolve, reject) => {
            const firebaseIntegration = new FirebaseIntegration((authError) => {
                if (authError) {
                    reject(authError);
                }
            
                const reference = firebaseIntegration.reference;
                reference.add(toDoList).then((toDoListId) => {
                    resolve(toDoListId);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
}