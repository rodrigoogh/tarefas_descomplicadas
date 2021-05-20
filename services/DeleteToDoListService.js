import FirebaseIntegration from './FirebaseIntegration';

export default class DeleteToDoListService {
    execute(toDoList) {
        const {id} = toDoList;
        return new Promise((resolve, reject) => {
            const firebaseIntegration = new FirebaseIntegration((authError) => {
                if (authError) {
                    reject(authError);
                }
                
                const reference = firebaseIntegration.reference;
                reference.doc(id).delete().then(() => {
                    resolve(true);
                }).catch((error) => {
                    reject(error);
                });
            });
        });
    }
}